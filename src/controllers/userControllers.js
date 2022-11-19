const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {
  findAll,
  findById,
  findByName,
  deleteById,
  createUser,
  updateUser,
} = require("../repository/userRepo");

const getUsersHandler = asyncHandler(async (req, res) => {
  const users = await findAll();
  if (!users?.length) {
    return res.status(400).json({ message: "Users not found" });
  }

  return res.json(users);
});

const getUserHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await findById(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  return res.json(user);
});

const createUserHandler = asyncHandler(async (req, res) => {
  const { type, name, email, password } = req.body;

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
    : {
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

const updateUserHandler = asyncHandler(async (req, res) => {
  const { type, name, email, password } = req.body;
  const { id } = req.params;

  if (!type || !name || !email) {
    return res.status(400).json({ message: "Fields must be provided." });
  }

  const user = await findById(id);

  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  const duplicate = await findByName(name);

  if (duplicate && duplicate?.id !== id) {
    return res.status(409).json({ message: "Duplicate user name." });
  }

  user.type = type;
  user.name = name;
  user.email = email;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await updateUser(user, id);

  res.json({ message: `User ${updatedUser.username} updated successfully` });
});

const deleteUserHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await findById(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const deletedUser = await deleteById(id);

  res.json({ message: `User ${deletedUser.name} deleted successfully` });
});

module.exports = {
  getUsersHandler,
  getUserHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
};
