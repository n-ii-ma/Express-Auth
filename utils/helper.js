// Check if user is authenticated
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/users/dashboard");
  } else {
    next();
  }
};

// Check if user is not authenticated
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/users/login");
  }
};

module.exports = { checkAuthenticated, checkNotAuthenticated };
