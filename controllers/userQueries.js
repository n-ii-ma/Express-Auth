// INSERT user
const insertUser =
  "INSERT INTO users (id, name, email, username, password) VALUES ($1, $2, $3, $4, $5)";

module.exports = {
  insertUser,
};
