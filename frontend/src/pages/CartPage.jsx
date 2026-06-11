import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import "../styles/cart.css";

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart-container">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to see them here.</p>
          <Link to="/products" className="shop-link">
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="cart-item-details">
                <img
                  src="https://via.placeholder.com/80"
                  alt={item.product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>Category: {item.product.category}</p>
                  <p>Stock: {item.product.stock}</p>
                  <span className="cart-item-price">₹ {item.product.price}</span>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹ {cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹ {cartTotal}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
