import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "../styles/admin.css";
import "../styles/status.css";

const STATUS_OPTIONS = ["Pending", "Paid", "Shipped", "Delivered"];
const FILTER_OPTIONS = ["All", ...STATUS_OPTIONS];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter
  const [activeFilter, setActiveFilter] = useState("All");

  // Expandable rows
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status update tracking
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/orders");
      setOrders(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to load orders for admin", err);
      setError("Failed to retrieve system order lists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Filter orders
  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status?.toLowerCase() === activeFilter.toLowerCase());

  // Count per status
  const getStatusCount = (status) => {
    if (status === "All") return orders.length;
    return orders.filter((o) => o.status?.toLowerCase() === status.toLowerCase()).length;
  };

  // Toggle expand
  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Get badge class for status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "paid":
        return "warning";
      case "pending":
      default:
        return "danger";
    }
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      addToast(`Order #${orderId} status updated to "${newStatus}".`);
    } catch (err) {
      console.error("Status update error:", err);
      addToast(
        err.response?.data?.message || "Failed to update order status.",
        "error"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ==================== RENDER ====================

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
        <button className="admin-btn admin-btn-primary" onClick={fetchAllOrders}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Toast notifications */}
      <div className="admin-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`admin-toast toast-${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
            <button className="admin-toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="admin-header">
        <h1>Orders Management</h1>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-tabs">
        {FILTER_OPTIONS.map((status) => (
          <button
            key={status}
            className={`admin-filter-tab ${activeFilter === status ? "active" : ""}`}
            onClick={() => setActiveFilter(status)}
          >
            {status}
            <span className="tab-count">{getStatusCount(status)}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <>
              <tr key={order.id}>
                <td>
                  <button
                    className="admin-expand-btn"
                    onClick={() => toggleExpand(order.id)}
                    title="View order items"
                  >
                    {expandedOrderId === order.id ? "▼" : "▶"}
                  </button>
                </td>
                <td style={{ fontWeight: 700 }}>#{order.id}</td>
                <td>User #{order.user_id}</td>
                <td>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td style={{ fontWeight: 600 }}>₹ {Number(order.total_amount).toLocaleString()}</td>
                <td>
                  <span className={`admin-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-status-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingOrderId === order.id}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Expanded items row */}
              {expandedOrderId === order.id && (
                <tr key={`items-${order.id}`} className="admin-order-items-row">
                  <td colSpan="7">
                    <div className="admin-order-items-inner">
                      <h4>Order Items</h4>
                      {order.items && order.items.length > 0 ? (
                        <div className="admin-order-items-list">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="admin-order-item">
                              <span className="admin-order-item-name">
                                {item.product_name}
                              </span>
                              <span className="admin-order-item-qty">
                                × {item.quantity}
                              </span>
                              <span className="admin-order-item-price">
                                ₹ {Number(item.price).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                          No item details available.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="7" className="admin-table-empty">
                {activeFilter === "All"
                  ? "No orders have been placed on the store yet."
                  : `No orders with status "${activeFilter}".`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersPage;
