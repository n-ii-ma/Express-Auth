const db = require("../db/index");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Queries
const { insertUser } = require("./userQueries");

// CREATE user
const register = async (req, res) => {
  const id = uuidv4();
  const { name, email, username, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(insertUser, [id, name, email, username, hashedPassword]);
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  register,
};
