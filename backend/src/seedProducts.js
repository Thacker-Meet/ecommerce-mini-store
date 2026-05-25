const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = require("./config/mongo");

const Product = require("./models/productModel");

const products = require("./data/products");


const seedProducts = async () => {

  try {

    await connectMongoDB();

    // delete old products
    await Product.deleteMany();

    // insert new products
    await Product.insertMany(products);

    console.log("Products seeded successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedProducts();