const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/index");
const bcrypt = require("bcrypt");

// Queries
const {
  findUserByUsername,
  findUserById,
} = require("../controllers/userQueries");

const initialize = (passport) => {
  const authenticateUser = async (username, password, done) => {
    try {
      // Checking if user with the given username exists
      const findUser = await db.query(findUserByUsername, [username]);
      // If user doesn't exist
      if (!findUser.rows.length) {
        return done(null, false, {
          message: "Username Incorrect!",
        });
      }
      // If user exists
      const user = findUser.rows[0];
      // Compare provided password with the hashed password in db
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect!" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authenticateUser
    )
  );

  // Store user id in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Fetch user data from session
  passport.deserializeUser(async (id, done) => {
    try {
      // Checking if user with the stored id exists
      const findUser = await db.query(findUserById, [id]);
      const user = findUser.rows[0];
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

module.exports = initialize;
