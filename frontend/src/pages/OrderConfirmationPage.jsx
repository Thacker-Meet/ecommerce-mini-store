import { Link, useSearchParams } from "react-router-dom";
import "../styles/cart.css";

function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="cart-container">
      <div className="confirmation-card">
        <div className="confirmation-icon">✔</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with us. Your order has been placed and is being processed.</p>
        {orderId && (
          <div>
            <span className="order-id-label" style={{ display: "block", color: "#6b7280", fontSize: "0.9rem", marginBottom: "5px" }}>Order ID</span>
            <div className="order-id-badge">#{orderId}</div>
          </div>
        )}
        <div className="confirmation-actions">
          <Link to="/orders" className="shop-link">
            View Order History
          </Link>
          <Link to="/products" className="secondary-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
