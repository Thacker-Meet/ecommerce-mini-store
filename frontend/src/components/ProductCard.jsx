import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import "../styles/productCard.css";

function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isInCart = cartItems.some((item) => item.product._id === product._id);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      navigate("/cart");
    } else {
      if (product.stock <= 0) {
        alert("This product is out of stock!");
        return;
      }
      addToCart(product);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="product-link"
    >
      <div className="product-card">
        <div className="product-image-container">
          <img
            src="https://via.placeholder.com/200"
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <div className="product-meta">
            <h2>{product.name}</h2>
            <p>{product.category}</p>
            <p>
              Stock: {product.stock}
            </p>
          </div>

          <h3>
            ₹ {product.price}
          </h3>
        </div>

        <button 
          onClick={handleButtonClick}
          disabled={product.stock <= 0 && !isInCart}
          className={isInCart ? "go-to-cart-btn" : ""}
          style={{ 
            opacity: (product.stock <= 0 && !isInCart) ? 0.6 : 1,
            backgroundColor: isInCart ? "#10b981" : "#111827"
          }}
        >
          {product.stock <= 0 && !isInCart ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;