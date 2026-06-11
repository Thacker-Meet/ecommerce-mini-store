import { useEffect, useState } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import "../styles/cart.css";
import "../styles/status.css";

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders/my-orders");
        // Expecting response.data to be an array of orders (each order contains its items)
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError("Could not load your order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Loading Order History...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Order History</h1>
      <p style={{ marginBottom: "20px" }}>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>

      {orders.length === 0 ? (
        <div className="empty-cart-container" style={{ padding: "40px" }}>
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta-info">
                  <div className="order-meta-item">
                    <h4>Order Placed</h4>
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="order-meta-item">
                    <h4>Total</h4>
                    <p>₹ {order.total_amount}</p>
                  </div>
                  <div className="order-meta-item">
                    <h4>Order #</h4>
                    <p>{order.id}</p>
                  </div>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-items-grid">
                {order.items && order.items.map((item, idx) => (
                  <div key={item.id || idx} className="order-item-row">
                    <span className="order-item-name">
                      {item.product_name} <strong style={{ color: "#111827" }}>x {item.quantity}</strong>
                    </span>
                    <span className="order-item-subtotal">
                      ₹ {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;