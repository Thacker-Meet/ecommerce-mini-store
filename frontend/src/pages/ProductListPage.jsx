import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

import "../styles/global.css";
import "../styles/productList.css";
import "../styles/productCard.css";
import "../styles/status.css";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
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

  const categories = [
    "All",
    "Mobiles",
    "Laptops",
    "Headphones",
    "Smartwatch",
    "Camera",
    "Shoes",
    "Clothing",
    "Accessories",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="container fade-in" style={{ padding: "40px 20px" }}>
      <div className="list-header">
        <h1 className="product-list-title">All Products</h1>
        <p className="product-count">{filteredProducts.length} Products Found</p>
      </div>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active-category" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="empty-state">
            <h2>No Products Found</h2>
            <p>Try changing category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;