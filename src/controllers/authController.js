const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { findAll, findByName, createUser } = require("../repository/userRepo");
const UserType = require("../constants/UserType");

//  @description Get all users
//  @route GET /auth/users
//  @access private <only for admin>
const getUsersHandler = asyncHandler(async (req, res) => {
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (req.type && req.type !== UserType.ADMIN) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const users = await findAll();
  if (!users?.length) {
    return res.status(400).json({ message: "Users not found" });
  }

  return res.json(users);
});

//  @description Login user
//  @route POST /auth/signin
//  @access public
const signInHandler = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const userFound = await findByName(name);

  if (!userFound) {
    return res.status(401).json({ message: "User not found." });
  }

  const userAuthenticated = await bcrypt.compare(password, userFound.password);

  if (!userAuthenticated) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const accessToken = jwt.sign(
    {
      name: userFound.name,
      type: userFound.type,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  res.json({ accessToken });
});

//  @description Logup user
//  @route POST /auth/signup
//  @access public <not reacheable by admin>
const signUpHandler = asyncHandler(async (req, res) => {
  const { type, name, email, password } = req.body;
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (req.type && req.type === UserType.ADMIN) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  const duplicate = await findByName(name);

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate user name." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = !type
    ? { name, email, password: hashedPassword }
    : //Type of user is indicated for convenience only should be removed!!!
      {
        type,
        name,
        email,
        password: hashedPassword,
      };

  const created = await createUser(userObject);

  if (created) {
    res.status(201).json({
      message: `User ${userObject.name} created successfully`,
    });
  } else {
    res.status(400).json({
      message: `User ${userObject.name} could not be created`,
    });
  }
});

module.exports = {
  getUsersHandler,
  signInHandler,
  signUpHandler,
};
