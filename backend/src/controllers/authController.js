const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { mysqlConnection } = require("../config/mysql");

const signup = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "All fields required",
      });
    }

    mysqlConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {

        if (err) {

          return res.status(500).json({
            message: "Database error",
          });
        }

        if (results.length > 0) {

          return res.status(400).json({
            message:
              "Email already exists",
          });
        }

        const hashedPassword =
          await bcrypt.hash(
            password,
            10
          );

        mysqlConnection.query(
          `INSERT INTO users
          (name,email,password_hash)
          VALUES (?,?,?)`,
          [
            name,
            email,
            hashedPassword,
          ],
          (err, result) => {

            if (err) {

              return res.status(500).json({
                message:
                  "Insert failed",
              });
            }

            const token =
              jwt.sign(
                {
                  id: result.insertId,
                  email,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn:
                    process.env.JWT_EXPIRES_IN,
                }
              );

            res.status(201).json({
              message:
                "User created",
              token,
            });
          }
        );
      }
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    mysqlConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {

        if (
          err ||
          results.length === 0
        ) {

          return res.status(400).json({
            message:
              "Invalid credentials",
          });
        }

        const user =
          results[0];

        const isMatch =
          await bcrypt.compare(
            password,
            user.password_hash
          );

        if (!isMatch) {

          return res.status(400).json({
            message:
              "Invalid credentials",
          });
        }

        const token =
          jwt.sign(
            {
              id: user.id,
              email:
                user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn:
                process.env.JWT_EXPIRES_IN,
            }
          );

        res.json({
          message:
            "Login successful",
          token,
        });
      }
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMe = (req, res) => {

    mysqlConnection.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        [req.user.id],
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message:
                        "Database error",
                });
            }

            if (
                results.length === 0
            ) {

                return res.status(404).json({
                    message:
                        "User not found",
                });
            }

            res.json(results[0]);
        }
    );
};

module.exports = {
  signup,
  login,
  getMe,
};