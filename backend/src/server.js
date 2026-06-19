const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectMongoDB = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const pingRoutes = require("./routes/pingRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const authRoutes =
  require(
    "./routes/authRoutes"
  );
const protectedRoutes =
  require(
    "./routes/protectedRoutes"
  );
const adminRoutes = require("./routes/adminRoutes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

connectMongoDB();
connectMySQL();

app.use("/api", pingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/protected",
  protectedRoutes
);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Error handler must be AFTER all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});