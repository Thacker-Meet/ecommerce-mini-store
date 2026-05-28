import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

import "../styles/productDetail.css";

function ProductDetailPage() {


  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


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
    return <h1>Loading product...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }


  return (

    <div className="detail-container">
        <h1>Product Detail</h1>
      <div className="detail-card">
        
        <img
          src="https://via.placeholder.com/400"
          alt={product.name}
        />

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