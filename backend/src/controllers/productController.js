const Product = require("../models/productModel");


// GET all products
const getProducts = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;

    const limit = 50;

    const skip = (page - 1) * limit;

    const category = req.query.category;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({

      products,

      currentPage: page,

      totalPages: Math.ceil(totalProducts / limit),

      totalProducts,

    });

  } catch (error) {

    res.status(500);

    throw new Error(error.message);
  }
};


// GET single product
const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// CREATE product
const createProduct = async (req, res) => {
  try {

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE product
const updateProduct = async (req, res) => {
  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE product
const deleteProduct = async (req, res) => {
  try {

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};