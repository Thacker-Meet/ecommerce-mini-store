import { Link } from "react-router-dom";
import "../styles/navbar.css";
function Navbar() {

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

        <Link to="/products">
          Products
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;