import { useEffect, useState } from "react";

import API from "../services/api";

import ProductCard from "../components/ProductCard";

import "../styles/global.css";

import "../styles/home.css";

import "../styles/productCard.css";

import "../styles/status.css";


function HomePage() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
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

  const popularProducts = products.slice(0, 6);

  const filteredProducts = popularProducts.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (

    <div className="home-container">

      <h1 className="hero-title">
        Welcome to E-Commerce Mini Store
      </h1>

      <p className="hero-subtitle">
        Discover amazing products at the best prices
      </p>

      <input
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />
      <h2 className="section-title">
        Popular Products
      </h2>

      <div className="product-grid">

        {filteredProducts.map((product) => (

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