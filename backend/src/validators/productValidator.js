const { body } = require("express-validator");

const productValidationRules = [

  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("slug")
    .notEmpty()
    .withMessage("Slug is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("stock")
    .isNumeric()
    .withMessage("Stock must be numeric"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

];

module.exports = productValidationRules;