// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Backend Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// DAY 3 first one commit
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectMongoDB = require("./config/mongo");
// const { connectMySQL } = require("./config/mysql");

// const app = express();

// app.use(cors());
// app.use(express.json());

// connectMongoDB();
// connectMySQL();

// app.get("/", (req, res) => {
//     res.send("Backend Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// Day 3 second commit 
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongoDB = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const pingRoutes = require("./routes/pingRoutes");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();

app.use(cors());
app.use(express.json());

connectMongoDB();
connectMySQL();
app.use(errorHandler);
app.use("/api", pingRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});