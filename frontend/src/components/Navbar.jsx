import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const closeMenu = () => setIsMobileOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
      >
        Cartify
      </Link>

      <button className="hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        ☰
      </button>

      <div className={`nav-links ${isMobileOpen ? "mobile-open" : ""}`}>
        <Link to="/" className={isActive("/")} onClick={closeMenu}>Home</Link>
        <Link to="/products" className={isActive("/products")} onClick={closeMenu}>Products</Link>
        <Link to="/cart" className={isActive("/cart")} onClick={closeMenu}>Cart ({cartCount})</Link>

        {user ? (
          <>
            <Link to="/orders" className={isActive("/orders")} onClick={closeMenu}>Orders</Link>
            {user.role === "admin" && (
              <Link to="/admin/dashboard" className={location.pathname.startsWith("/admin") ? "active" : ""} style={{ color: "var(--primary-color)", fontWeight: "800" }} onClick={closeMenu}>Admin</Link>
            )}
            <span className="user-name">
              Hello {user.name}
            </span>
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login")} onClick={closeMenu}>Login</Link>
            <Link to="/signup" className={isActive("/signup")} onClick={closeMenu}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;