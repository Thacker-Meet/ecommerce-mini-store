import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
      >
        MiniStore
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {user ? (
          <>
            <Link to="/orders">Orders</Link>
            {user.role === "admin" && (
              <Link to="/admin/products" style={{ color: "#2563eb", fontWeight: "700" }}>Admin</Link>
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
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;