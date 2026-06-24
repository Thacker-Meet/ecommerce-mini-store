import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2>Cartify</h2>
          <p>Your One-Stop Online Shopping Destination</p>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@cartify.com</p>
          <p>Phone: +91 1234 567 890</p>
          <p>Address: 123 Cartify Lane, E-Commerce City</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Cartify. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
