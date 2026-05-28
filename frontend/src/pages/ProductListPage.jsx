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

      <h1 className="section-title">
        All Products
      </h1>

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

export default ProductListPage;