import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/admin.css";

function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "admin-sidebar-link active" : "admin-sidebar-link";
  };

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <Link to="/admin/products" className={isActive("/admin/products")}>
          Manage Products
        </Link>
        <Link to="/admin/orders" className={isActive("/admin/orders")}>
          Manage Orders
        </Link>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
