const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongoDB = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const pingRoutes = require("./routes/pingRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
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

app.use(cors());
app.use(express.json());

connectMongoDB();
connectMySQL();
app.use(errorHandler);
app.use("/api", pingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/protected",
  protectedRoutes
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});