const { Sequelize } = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    // logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    // await db.sync();
    // await db.sync({ force: true });
    await db.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connectDatabase, db };
