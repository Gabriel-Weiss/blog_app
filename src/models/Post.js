const { DataTypes, Model } = require("sequelize");
const { db } = require("../config/dbConnection");

const Post = db.define(
  "post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      field: "is_hidden",
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Post;
