const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Queries
const { insertUser } = require("./userQueries");

// CREATE user
const register = async (req, res) => {
  let errors = [];
  const id = uuidv4();
  const { name, email, username, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(insertUser, [id, name, email, username, hashedPassword]);
    res.redirect("/users/login");
  } catch (err) {
    // If UNIQUE constraint is violated
    if (err.code == "23505") {
      errors.push({ message: "Email or Username Already Taken" });
      res.status(400).render("register", { errors });
    } else {
      errors.push({ message: "Something Went Wrong" });
      res.status(500).render("register", { errors });
    }
  }
};

module.exports = {
  register,
};
