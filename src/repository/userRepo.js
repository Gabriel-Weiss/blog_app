const User = require("../models/User");

const findAll = () => {
  return User.findAll();
};

const findById = (id) => {
  return User.findByPk(id);
};

const findByName = (name) => {
  return User.findOne({ where: { name: name } });
};

const deleteById = (id) => {
  return User.destroy({ where: { id: id } });
};

const createUser = (user) => {
  var newUser = new User(user);
  return newUser.save();
};

const updateUser = (user, id) => {
  const updatedUser = {
    type: user.type,
    name: user.name,
    email: user.email,
    password: user.password,
  };
  return User.update(updatedUser, { where: { id: id } });
};

module.exports = {
  findAll,
  findById,
  findByName,
  deleteById,
  createUser,
  updateUser,
};
