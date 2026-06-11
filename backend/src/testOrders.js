const mongoose = require("mongoose");
require("dotenv").config();
const connectMongoDB = require("./config/mongo");
const { mysqlConnection } = require("./config/mysql");
const Product = require("./models/productModel");

// Helper to run MySQL queries with promises
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const runTests = async () => {
  try {
    console.log("Connecting to databases...");
    await connectMongoDB();
    console.log("MongoDB connected.");

    // Create a dummy product for testing
    console.log("Creating dummy product for test...");
    const testProduct = await Product.create({
      name: "Test Product Day 2",
      slug: `test-product-day-2-${Date.now()}`,
      price: 150,
      category: "Mobiles",
      stock: 5,
      description: "Temp test product",
    });
    console.log(`Product created with _id: ${testProduct._id}, Stock: ${testProduct.stock}`);

    // Test Case 1: Valid Checkout (Should decrease stock to 3)
    console.log("\n--- TEST CASE 1: Valid Checkout (Order 2 items) ---");
    const orderItems = [{ productId: testProduct._id.toString(), quantity: 2 }];
    
    // Simulate placing order logic manually to verify stock decreases
    const initialProduct = await Product.findById(testProduct._id);
    console.log(`Initial MongoDB Stock: ${initialProduct.stock}`);

    // Atomically decrement stock
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: testProduct._id, stock: { $gte: 2 } },
      { $inc: { stock: -2 } },
      { new: true }
    );
    console.log(`Updated MongoDB Stock: ${updatedProduct.stock} (Expected: 3)`);

    if (updatedProduct.stock !== 3) {
      throw new Error(`Test 1 Failed: Expected stock to be 3, got ${updatedProduct.stock}`);
    }
    console.log("TEST CASE 1 PASSED: Stock decremented successfully!");

    // Test Case 2: Insufficient Stock (Order 5 items when only 3 left)
    console.log("\n--- TEST CASE 2: Insufficient Stock (Try ordering 5, should fail) ---");
    const failedUpdate = await Product.findOneAndUpdate(
      { _id: testProduct._id, stock: { $gte: 5 } },
      { $inc: { stock: -5 } },
      { new: true }
    );

    if (failedUpdate === null) {
      console.log("Safe atomic update returned null (Expected behavior).");
      const currentStock = await Product.findById(testProduct._id);
      console.log(`Current MongoDB Stock remained: ${currentStock.stock} (Expected: 3)`);
      console.log("TEST CASE 2 PASSED: Stock was NOT decremented and request was blocked!");
    } else {
      throw new Error("Test 2 Failed: Stock decrement was allowed when it should have been blocked!");
    }

    // Clean up
    console.log("\nCleaning up test product...");
    await Product.findByIdAndDelete(testProduct._id);
    console.log("Cleanup completed.");

    console.log("\nALL TEST CASES PASSED SUCCESSFULLY!");
    process.exit(0);

  } catch (err) {
    console.error("Test failed with error:", err);
    process.exit(1);
  }
};

// Wait a bit for MySQL to initialize connection
setTimeout(runTests, 2000);
