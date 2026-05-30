import { Link } from "react-router-dom";
import "../styles/productCard.css";

function ProductCard({ product }) {

  return (

    <Link
      to={`/products/${product._id}`}
      className="product-link"
    >

      <div className="product-card">

        <div className="product-image-container">

          <img
            src="https://via.placeholder.com/200"
            alt={product.name}
          />

        </div>

        <div className="product-info">

          <div className="product-meta">

            <h2>{product.name}</h2>

            <p>{product.category}</p>

            <p>
              Stock: {product.stock}
            </p>

          </div>

          <h3>
            ₹ {product.price}
          </h3>

        </div>

        <button>
          Add to Cart
        </button>

      </div>

    </Link>
  );
}

export default ProductCard;