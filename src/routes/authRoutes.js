const express = require("express");
const authHandler = require("../middleware/authHandler");
const router = express.Router();
const {
  getUsersHandler,
  signInHandler,
  signUpHandler,
  signOutHandler,
} = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router
  .post("/signin", loginLimiter, signInHandler) //Apply limiter for login logic
  .post("/signup", signUpHandler);

router
  .use(authHandler) //Verify jwt token for every endpoint
  .get("/users", getUsersHandler);

module.exports = router;
