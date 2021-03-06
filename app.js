// Inject environment variables
require("dotenv").config();

// Express App
const express = require("express");
const app = express();

// CORS
const cors = require("cors");
const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
  credentials: true,
  origin: isProduction ? process.env.ADDRESS : "*",
};

app.use(cors(corsOptions));

// Helmet
const helmet = require("helmet");
app.use(helmet());

// Gzip compression
const compression = require("compression");
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger with Morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// Trust Proxy
app.set("trust proxy", 1);

// Express Session
const session = require("express-session");
const db = require("./db/index");
const pgSession = require("connect-pg-simple")(session);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000, // 1 week
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
    },
    store: new pgSession({
      pool: db,
      createTableIfMissing: true,
    }),
  })
);

// CSRF
const csurf = require("csurf");
app.use(csurf());

// Passport
const initialize = require("./configs/passport");
const passport = require("passport");

initialize(passport);

app.use(passport.initialize());
app.use(passport.session());

// Express Flash
const flash = require("express-flash");
app.use(flash());

// Port
const PORT = process.env.PORT || 3000;

// Engine
app.set("view engine", "ejs");

// Router
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Error handling
app.use((err, req, res, next) => {
  // CSRF error handling
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).send("Form Tampered With!");
  } else {
    const status = err.status || 500;
    res.status(status).send(err.message);
  }
});

// Server
app.listen(PORT, () => console.log(`App Listening on Port ${PORT}`));
