import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import useCart from "../hooks/useCart";

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
        setProduct(response.data);
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
        <h1>Loading Products...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <button
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
    <div className="detail-container">
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1>Product Detail</h1>
      <div className="detail-card">
        <div className="detail-image">
          <img
            src="https://via.placeholder.com/400"
            alt={product.name}
          />
        </div>

        <div className="detail-content">
          <h1>{product.name}</h1>
          <p>
            Category: {product.category}
          </p>
          <h2>₹ {product.price}</h2>
          <p>
            Stock: {product.stock}
          </p>
          <p>
            {product.description}
          </p>
          <button 
            onClick={handleButtonClick}
            disabled={product.stock <= 0 && !isInCart}
            style={{ 
              opacity: (product.stock <= 0 && !isInCart) ? 0.6 : 1,
              backgroundColor: isInCart ? "#10b981" : "#111827"
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