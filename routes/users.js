const express = require("express");
const usersRouter = express.Router();

// Passport
const passport = require("passport");

// Callbacks
const register = require("../controllers/usersCallbacks");

// Helper functions
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../utils/helper");

// Validation
const registerValidation = require("../utils/validator");

//Rate limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
  messsage: "Too many requests! please try again later.",
  handler: (req, res) => {
    req.flash("limiter", "Too Many Requests! Please Try Again Later");
    res.redirect("/users/login");
  },
});

// Homepage
usersRouter.get("/", checkAuthenticated, (req, res) => {
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

// POST register
usersRouter.post("/register", registerValidation, register);

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

// Logout
usersRouter.post("/logout", checkNotAuthenticated, (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/users/login");
    }
  });
});

module.exports = usersRouter;
