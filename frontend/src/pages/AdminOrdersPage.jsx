import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/admin.css";
import "../styles/status.css";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await API.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to load orders for admin", err);
        setError("Failed to retrieve system order lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleUpdateStatus = (orderId) => {
    alert(`Mock status update triggered for Order #${orderId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Loading Admin Orders...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#0f172a", marginBottom: "20px" }}>Orders Management</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ fontWeight: 700 }}>#{order.id}</td>
              <td>User #{order.user_id}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td style={{ fontWeight: 600 }}>₹ {order.total_amount}</td>
              <td>
                <span className={`admin-badge ${order.status.toLowerCase() === "completed" ? "success" : "warning"}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleUpdateStatus(order.id)}
                  style={{ background: "#2563eb", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                No orders have been placed on the store yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
