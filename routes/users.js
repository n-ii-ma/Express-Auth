const express = require("express");
const usersRouter = express.Router();

// Homepage
usersRouter.get("/", (req, res) => {
  res.render("home");
});

// Register
usersRouter.get("/register", (req, res) => {
  res.render("register");
});

// Login
usersRouter.get("/login", (req, res) => {
  res.render("login");
});

// Dashboard
usersRouter.get("/dashboard", (req, res) => {
  res.render("dashboard", { name: "Nima" });
});

// Logout
usersRouter.get("/logout", (req, res) => {
  res.redirect("/users/login");
});

module.exports = usersRouter;
