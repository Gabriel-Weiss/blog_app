const { Sequelize } = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_NAME || "blog_app",
  process.env.DATABASE_USER || "postgres",
  process.env.DATABASE_PASS || "postgrespw",
  {
    host: process.env.DATABASE_HOST || "postgres",
    dialect: process.env.DATABASE_DIALECT || "postgres",
    logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Connection established successfully.");
    await db.sync();
    // await db.sync({ force: true });
    // await db.sync({ alter: true });
    console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { connectDatabase, db };
