import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../utils/imageUtils";
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
            src={getImageUrl(product.image)}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('no-image');
            }}
          />
          <div className="no-image-text">No Image Available</div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h2>{product.name}</h2>
            <h3>₹ {product.price}</h3>
          </div>
          <div className="product-meta">
            <p>{product.category}</p>
            <p>Stock: {product.stock}</p>
          </div>
        </div>

        <button 
          onClick={handleButtonClick}
          disabled={product.stock <= 0 && !isInCart}
          className={isInCart ? "go-to-cart-btn" : ""}
          style={{ 
            opacity: (product.stock <= 0 && !isInCart) ? 0.6 : 1,
            backgroundColor: isInCart ? "var(--secondary-color)" : "var(--primary-color)"
          }}
        >
          {product.stock <= 0 && !isInCart ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;