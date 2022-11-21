const User = require("../models/User");

const findAll = () => {
  return User.findAll({
    attributes: ["id", "type", "name", "email"],
    raw: true,
  });
};

const findByName = (name) => {
  return User.findOne({ where: { name } });
};

const createUser = (user) => {
  const newUser = new User(user);
  return newUser.save();
};

module.exports = {
  findAll,
  findByName,
  createUser,
};
