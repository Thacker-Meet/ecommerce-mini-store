import { useEffect, useState } from "react";

import API from "../services/api";

import ProductCard from "../components/ProductCard";

import "../styles/global.css";

import "../styles/home.css";

import "../styles/productCard.css";


function HomePage() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await API.get("/products");

        setProducts(response.data.products || response.data);

        setLoading(false);

      } catch (err) {

        setError("Failed to fetch products");

        setLoading(false);
      }
    };

    fetchProducts();

  }, []);


  if (loading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }


  return (

    <div className="home-container">

      <h1 className="hero-title">
        Welcome to E-Commerce Mini Store
      </h1>

      <p className="hero-subtitle">
        Discover amazing products at the best prices
      </p>

      <h2 className="section-title">
        Popular Products
      </h2>

      <div className="product-grid">

        {products.map((product) => (

          <ProductCard
            key={product._id}
            product={product}
          />

        ))}

      </div>

    </div>
  );
}

export default HomePage;