import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const popularProducts = products.slice(0, 8);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <h1 className="hero-title">Shop Smarter with Cartify</h1>
        <p className="hero-subtitle">
          Discover top products across electronics, fashion, accessories, and more.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">Shop Now</Link>
          <Link to="/products" className="btn-secondary">Browse Products</Link>
        </div>
      </section>

      {/* Popular Products */}
      <section className="popular-products-section container slide-up">
        <h2 className="section-title">Popular Products</h2>
        <div className="product-grid">
          {popularProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Cartify */}
      <section className="why-choose-section container slide-up">
        <h2 className="section-title">Why Choose Cartify</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast Shipping</h3>
            <p>Get your products delivered quickly and safely.</p>
          </div>
          <div className="feature-card">
            <h3>Best Quality</h3>
            <p>We source only the best quality products for you.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Our customer support team is always here to help.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;