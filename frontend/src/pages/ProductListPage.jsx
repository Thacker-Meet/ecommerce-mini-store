import { useEffect, useState } from "react";

import API from "../services/api";

import ProductCard from "../components/ProductCard";

import "../styles/global.css";
import "../styles/productList.css";
import "../styles/productCard.css";

function ProductListPage() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");


  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response =
          await API.get("/products");

        setProducts(
          response.data.products ||
          response.data
        );

        setLoading(false);

      } catch (err) {

        setError(
          "Failed to fetch products"
        );

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


  const filteredProducts =
    products.filter((product) => {

      const matchesCategory =

        selectedCategory === "All" ||

        product.category === selectedCategory;


      const matchesSearch =

        product.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );


      return (
        matchesCategory &&
        matchesSearch
      );
    });


  if (loading) {

    return (
      <h1 className="loading">
        Loading products...
      </h1>
    );
  }


  if (error) {

    return (
      <h1 className="error">
        {error}
      </h1>
    );
  }


  return (

    <div className="home-container">

      <h1 className="product-list-title">
        All Products
      </h1>

      <p className="product-count">
        {filteredProducts.length} Products Found
      </p>

      {/* Search Bar */}

      <input
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      {/* Category Filters */}

      <div className="category-filters">

        {categories.map((category) => (

          <button
            key={category}
            className={
              selectedCategory === category
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>

        ))}

      </div>

      {/* Products */}

      <div className="product-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))

        ) : (

          <div className="empty-state">

            <h2>No Products Found</h2>

            <p>
              Try changing category or search term.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductListPage;