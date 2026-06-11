import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/admin.css";
import "../styles/status.css";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data.products || response.data);
      } catch (err) {
        console.error("Failed to load products for admin", err);
        setError("Failed to fetch product catalog.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMockAction = (action, name) => {
    alert(`Mock Action: "${action}" triggered for product "${name}".`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Loading Admin Products...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a" }}>Products Management</h1>
        <button 
          onClick={() => alert("Scaffold Action: Add new product dialog placeholder.")}
          style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          + Add Product
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ fontWeight: 600 }}>{product.name}</td>
              <td>{product.category}</td>
              <td>₹ {product.price}</td>
              <td>{product.stock} items</td>
              <td>
                <button 
                  onClick={() => handleMockAction("Edit", product.name)}
                  style={{ marginRight: "10px", background: "#e2e8f0", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleMockAction("Delete", product.name)}
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductsPage;
