import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import API from "../services/api";
import "../styles/cart.css";
import "../styles/status.css";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    // Double check local stocks before submission
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        setError(
          `Cannot place order. Requested quantity for "${item.product.name}" exceeds available stock (${item.product.stock}).`
        );
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const response = await API.post("/orders", orderData);
      
      // On success, clear cart and redirect to confirmation
      clearCart();
      // Backend returns { success: true, data: { orderId, totalAmount } }
      const orderPayload = response.data?.data || response.data;
      const orderId = orderPayload.orderId || orderPayload.id;
      navigate(`/order-confirmation?orderId=${orderId}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart-container">
          <h2>No items in checkout</h2>
          <button className="checkout-btn" onClick={() => navigate("/products")}>
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Checkout</h1>
      
      {error && (
        <div 
          className="error-banner" 
          style={{ 
            backgroundColor: "#fee2e2", 
            border: "1px solid #fecaca", 
            color: "#991b1b", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "24px", 
            fontWeight: "600",
            fontSize: "0.95rem"
          }}
        >
          {error}
        </div>
      )}
      
      <div className="cart-grid">
        <div className="cart-items-list">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form" style={{ marginTop: "20px" }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="checkout-btn"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Processing Order..." : `Place Order (₹ ${cartTotal})`}
            </button>
          </form>
        </div>
        
        <div className="cart-summary">
          <h2 className="summary-title">Items in Order</h2>
          {cartItems.map((item) => (
            <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 600 }}>{item.product.name}</span>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>Qty: {item.quantity}</p>
              </div>
              <span>₹ {item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row total" style={{ marginTop: "20px" }}>
            <span>Total Amount</span>
            <span>₹ {cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
