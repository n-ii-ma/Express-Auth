// Inject environment variables
require("dotenv").config();

// Express App
const express = require("express");
const app = express();

// CORS
const cors = require("cors");
// const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: "*",
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

//Rate limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
});

app.use(limiter);

// Port
const PORT = process.env.PORT || 3000;

// Engine
app.set("view engine", "ejs");

// Router
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});

// Server
app.listen(PORT, () => console.log(`App Listening on Port ${PORT}`));
