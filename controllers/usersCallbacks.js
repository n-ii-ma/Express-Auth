const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Queries
const { insertUser } = require("./userQueries");

// CREATE user
const register = async (req, res) => {
  const errors = validationResult(req);
  const id = uuidv4();
  const { name, email, username, password } = req.body;

  // Validation
  if (!errors.isEmpty()) {
    req.flash("validation_errors", `${errors.array()[0].msg}`);
    return res.status(400).render("register");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(insertUser, [id, name, email, username, hashedPassword]);
    req.flash("success", "Registered Succressfully! Please Log In");
    res.redirect("/users/login");
  } catch (err) {
    // If UNIQUE constraint is violated
    if (err.code == "23505") {
      req.flash("constraint_error", "Email or Username Already Taken");
      res.status(400).render("register");
    } else {
      req.flash("server_error", "Something Went Wrong");
      res.status(500).render("register");
    }
  }
};

module.exports = register;
