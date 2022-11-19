const { DataTypes } = require("sequelize");
const { db } = require("../config/dbConnection");
const UserType = require("../constants/UserType");
const Post = require("./Post");

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(UserType),
      defaultValue: UserType.BLOGGER,
      allowNull: false,
      validate: {
        isIn: [Object.values(UserType)],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Post, { foreignKey: "authorId", as: "posts" });

module.exports = User;
