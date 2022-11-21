const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

/*
Middleware to verify presence of jwt token and deconding it.
Set to request object name and type of current user
*/

const authHandler = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  const token = authHeader?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.name = decoded.name;
    req.type = decoded.type;
    next();
  });
});

module.exports = authHandler;
