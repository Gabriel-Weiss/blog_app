const express = require("express");
const errorHandler = require("./middleware/errorHandler");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false })); //Use urlencoded text for every request

  app.use("/auth", require("./routes/authRoutes"));
  app.use("/posts", require("./routes/postRoutes"));

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
