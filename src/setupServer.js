const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");

const createApp = () => {
  const app = express();

  app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
  // app.use(cookieParser());
  // app.use(cors(corsOptions));
  // app.use("/stripe", require("./routes/stripeRoutes"));
  // app.use("/auth", require("./routes/authRoutes"));
  // app.use("/markets", require("./routes/marketRoutes"));
  // app.use("/products", require("./routes/productRoutes"));
  // app.use("/restaurants", require("./routes/restaurantRoutes"));
  app.use("/users", require("./routes/userRoutes"));
  app.use("/posts", require("./routes/postRoutes"));

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
