const { mysqlConnection } = require("../config/mysql");
const Product = require("../models/productModel");

// Helper to run MySQL queries with promises
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// @desc    Create new order with safe stock decrement & rollback
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "No order items provided" });
  }

  const decrementedItems = [];
  let totalAmount = 0;

  try {
    // Step 1: Safe Atomic Stock Decrement in MongoDB
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        throw new Error("Invalid product ID or quantity");
      }

      // Atomically decrement stock only if it's greater than or equal to quantity
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Fetch product to see if it exists or if it's out of stock
        const product = await Product.findById(productId);
        const name = product ? product.name : `Product ID: ${productId}`;
        const available = product ? product.stock : 0;
        
        const errorMessage = product 
          ? `Insufficient stock for ${name}. Available: ${available}, requested: ${quantity}`
          : `Product not found: ${productId}`;

        // Trigger rollback for previously decremented items
        await rollbackMongoDBStock(decrementedItems);
        return res.status(400).json({ success: false, message: errorMessage });
      }

      // Track successful decrement for rollback purposes
      decrementedItems.push({
        productId,
        quantity,
        name: updatedProduct.name,
        price: updatedProduct.price,
      });

      totalAmount += updatedProduct.price * quantity;
    }

    // Step 2: Insert order header into MySQL
    const user_id = req.user.id;
    let orderId;
    try {
      const orderInsertResult = await query(
        "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
        [user_id, totalAmount, "Pending"]
      );
      orderId = orderInsertResult.insertId;
    } catch (mysqlError) {
      console.error("MySQL Order Insert Failed, rolling back MongoDB stocks...");
      await rollbackMongoDBStock(decrementedItems);
      return res.status(500).json({ success: false, message: "Database write error. Order aborted.", error: mysqlError.message });
    }

    // Step 3: Insert order items into MySQL
    try {
      const orderItemsData = decrementedItems.map((item) => [
        orderId,
        item.productId,
        item.name,
        item.quantity,
        item.price,
      ]);

      await query(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ?",
        [orderItemsData]
      );
    } catch (mysqlItemsError) {
      console.error("MySQL Order Items Insert Failed, rolling back MongoDB stocks and deleting order...");
      // Revert MongoDB stock
      await rollbackMongoDBStock(decrementedItems);
      // Attempt to clean up order header
      try {
        await query("DELETE FROM orders WHERE id = ?", [orderId]);
      } catch (cleanupErr) {
        console.error("Failed to delete orphaned order record:", cleanupErr);
      }
      return res.status(500).json({ success: false, message: "Database items write error. Order aborted.", error: mysqlItemsError.message });
    }

    // Success response
    res.status(201).json({
      success: true,
      data: {
        orderId,
        totalAmount,
      },
      message: "Order placed successfully",
    });

  } catch (error) {
    console.error("Order process error:", error);
    // General fallback rollback
    await rollbackMongoDBStock(decrementedItems);
    res.status(500).json({ success: false, message: "Order placement failed", error: error.message });
  }
};

// Helper function to rollback MongoDB stock increments
const rollbackMongoDBStock = async (items) => {
  if (items.length === 0) return;
  console.log(`Reverting stock for ${items.length} items...`);
  for (const item of items) {
    try {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
      console.log(`Successfully reverted stock for product ${item.name} by +${item.quantity}`);
    } catch (err) {
      console.error(`CRITICAL: Failed to rollback stock for product ID: ${item.productId}`, err);
    }
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch all orders for this user
    const orders = await query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    if (orders.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all items for these orders
    const orderIds = orders.map((o) => o.id);
    const orderItems = await query(
      "SELECT * FROM order_items WHERE order_id IN (?)",
      [orderIds]
    );

    // Group items by order id
    const ordersWithItems = orders.map((order) => {
      return {
        ...order,
        items: orderItems.filter((item) => item.order_id === order.id),
      };
    });

    res.json({ success: true, data: ordersWithItems });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    if (orders.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all items
    const orderItems = await query(
      "SELECT * FROM order_items"
    );

    // Group items by order id
    const ordersWithItems = orders.map((order) => {
      return {
        ...order,
        items: orderItems.filter((item) => item.order_id === order.id),
      };
    });

    res.json({ success: true, data: ordersWithItems });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Paid", "Shipped", "Delivered"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Check if order exists
    const existingOrder = await query("SELECT id FROM orders WHERE id = ?", [id]);

    if (existingOrder.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update the status
    await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    res.json({
      success: true,
      data: {
        orderId: Number(id),
        status,
      },
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
