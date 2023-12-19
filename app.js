const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./src/db/dbConnect');
const bcrypt = require("bcrypt");
const User = require("./src/db/models/userModel");
const jwt = require("jsonwebtoken");
const auth = require('./src/middleware/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const credentials = require("./src/middleware/credentials");

// Routes
const authRoutes = require('./src/routes/authRoutes');
const corsOptions = require("./src/config/corsOptions");
const errorHandler = require("./src/middleware/errorHandler");

dbConnect();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());


// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());


// this is a auth required route (Protected)
app.get("/users", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.get("/test", auth, (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// Authentication routes
app.use("/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
