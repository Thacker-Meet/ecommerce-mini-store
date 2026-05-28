import { Link } from "react-router-dom";
import "../styles/productCard.css";


function ProductCard({ product }) {

  return (

    <Link
      to={`/products/${product._id}`}
      className="product-link"
    >

      <div className="product-card">

        <img
          src="https://via.placeholder.com/200"
          alt={product.name}
        />

        <h2>{product.name}</h2>

        <p>{product.category}</p>

        <h3>₹ {product.price}</h3>

        <p>Stock: {product.stock}</p>

        <button>Add to Cart</button>

      </div>

    </Link>
  );
}

export default ProductCard;