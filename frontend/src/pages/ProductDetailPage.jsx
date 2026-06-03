import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "../styles/productDetail.css";
import "../styles/status.css";

function ProductDetailPage() {


  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const navigate = useNavigate();

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

          <button>
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetailPage;