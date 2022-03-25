// INSERT user
const insertUser =
  "INSERT INTO users (id, name, email, username, password) VALUES ($1, $2, $3, $4, $5)";

// SELECT user by username
const findUserByUsername = "SELECT * FROM users WHERE username = $1";

// SELECT user by id
const findUserById = "SELECT * FROM users WHERE id = $1";

module.exports = {
  insertUser,
  findUserByUsername,
  findUserById,
};
