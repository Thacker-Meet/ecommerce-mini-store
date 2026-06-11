const { mysqlConnection } = require("../config/mysql");

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Access denied. No authentication token." });
  }

  mysqlConnection.query(
    "SELECT role FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("Database error in adminMiddleware:", err);
        return res.status(500).json({ message: "Database query error." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const userRole = results[0].role;

      if (userRole !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      // User is admin, proceed
      next();
    }
  );
};

module.exports = adminMiddleware;
