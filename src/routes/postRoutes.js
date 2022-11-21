const express = require("express");
const authHandler = require("../middleware/authHandler");
const router = express.Router();
const {
  getPostsHandler,
  getUserPostsHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} = require("../controllers/postControllers");

router
  .use(authHandler) //Verify jwt token for every endpoint
  .get("/", getPostsHandler)
  .get("/self", getUserPostsHandler)
  .post("/", createPostHandler)
  .patch("/:id", updatePostHandler)
  .delete("/:id", deletePostHandler);

module.exports = router;
