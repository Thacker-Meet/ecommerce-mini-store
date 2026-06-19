import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import useCart from "../hooks/useCart";
import { getImageUrl } from "../utils/imageUtils";

import "../styles/productDetail.css";
import "../styles/status.css";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        const payload = response.data;
        // Backend returns { success: true, data: {...} }
        const productData = payload?.data || payload;
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isInCart = product && cartItems.some((item) => item.product._id === product._id);

  const handleButtonClick = () => {
    if (product) {
      if (isInCart) {
        navigate("/cart");
      } else {
        if (product.stock <= 0) {
          alert("This product is out of stock!");
          return;
        }
        addToCart(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Loading Product...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>{error || "Product not found"}</p>
        <button
          className="btn-primary"
          onClick={() =>
            window.location.reload()
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container fade-in">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      
      <div className="detail-card">
        <div className="detail-image">
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

        <div className="detail-content">
          <h1>{product.name}</h1>
          <p className="category-label">
            {product.category}
          </p>
          <h2>₹ {product.price}</h2>
          
          <div className="stock-info">
             <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
              {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
            </span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <button 
            className={`add-to-cart-btn ${isInCart ? 'go-to-cart-btn' : ''}`}
            onClick={handleButtonClick}
            disabled={product.stock <= 0 && !isInCart}
            style={{ 
              opacity: (product.stock <= 0 && !isInCart) ? 0.6 : 1,
              backgroundColor: isInCart ? "var(--secondary-color)" : "var(--primary-color)"
            }}
          >
            {product.stock <= 0 && !isInCart ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;