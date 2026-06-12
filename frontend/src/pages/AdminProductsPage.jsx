import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "../styles/admin.css";
import "../styles/status.css";

// Helper to generate slug from product name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  images: "",
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/products");
      setProducts(response.data.products || response.data);
      setError("");
    } catch (err) {
      console.error("Failed to load products for admin", err);
      setError("Failed to fetch product catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open modal for Add
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  // Open modal for Edit
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      images: product.images?.join(", ") || "",
    });
    setFormError("");
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.category.trim()) {
      setFormError("Name, description, and category are required.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      setFormError("Stock must be zero or a positive number.");
      return;
    }

    const slug = generateSlug(formData.name);
    const imagesArray = formData.images
      ? formData.images.split(",").map((url) => url.trim()).filter(Boolean)
      : [];

    const payload = {
      name: formData.name.trim(),
      slug,
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: imagesArray,
    };

    setFormLoading(true);

    try {
      if (editingProduct) {
        // UPDATE
        await API.put(`/products/${editingProduct._id}`, payload);
        addToast(`Product "${formData.name}" updated successfully!`);
      } else {
        // CREATE
        await API.post("/products", payload);
        addToast(`Product "${formData.name}" added successfully!`);
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error("Product save error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        "Failed to save product.";
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete product
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    try {
      await API.delete(`/products/${deleteTarget._id}`);
      addToast(`Product "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      addToast(err.response?.data?.message || "Failed to delete product.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==================== RENDER ====================

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
        <button className="admin-btn admin-btn-primary" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Toast notifications */}
      <div className="admin-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`admin-toast toast-${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
            <button className="admin-toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="admin-header">
        <h1>Products Management</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleAddNew}>
          + Add Product
        </button>
      </div>

      {/* Products Table */}
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
              <td>
                <span className="admin-badge info">{product.category}</span>
              </td>
              <td>₹ {product.price}</td>
              <td>
                <span
                  className={`admin-badge ${product.stock > 0 ? "success" : "danger"}`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </td>
              <td>
                <div className="admin-actions">
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleEdit(product)}
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => setDeleteTarget(product)}
                  >
                    ✕ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="5" className="admin-table-empty">
                No products found. Add your first product!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ==================== ADD/EDIT MODAL ==================== */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>

            {formError && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem", fontWeight: 600 }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Headphones"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-category">Category</label>
                <input
                  type="text"
                  id="product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="product-price">Price (₹)</label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="999"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="product-stock">Stock</label>
                  <input
                    type="number"
                    id="product-stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-images">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  id="product-images"
                  name="images"
                  value={formData.images}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image1.jpg, https://..."
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={handleCloseModal}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={formLoading}
                >
                  {formLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION ==================== */}
      {deleteTarget && (
        <div className="admin-confirm-overlay" onClick={() => !deleteLoading && setDeleteTarget(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div className="admin-confirm-actions">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
