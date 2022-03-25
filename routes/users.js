const express = require("express");
const usersRouter = express.Router();

// Passport
const passport = require("passport");

// Callbacks
const { register } = require("../controllers/usersCallbacks");

// Helper functions
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../utils/helper");

//Rate limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
});

// Homepage
usersRouter.get("/", (req, res) => {
  res.render("home");
});

// Register
usersRouter.get("/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

// Login
usersRouter.get("/login", checkAuthenticated, (req, res) => {
  res.render("login");
});

// Dashboard
usersRouter.get("/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { name: req.user.name });
});

// Logout
usersRouter.get("/logout", checkNotAuthenticated, (req, res) => {
  req.logOut();
  res.redirect("/users/login");
});

// POST register
usersRouter.post("/register", limiter, register);

// POST login
usersRouter.post(
  "/login",
  limiter,
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    successRedirect: "/users/dashboard",
    failureFlash: true,
  })
);

module.exports = usersRouter;
