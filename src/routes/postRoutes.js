const express = require("express");
const router = express.Router();
const {
  getPostsHandler,
  getPostHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} = require("../controllers/postControllers");

router
  .get("/", getPostsHandler)
  .get("/:id", getPostHandler)
  .post("/", createPostHandler)
  .patch("/:id", updatePostHandler)
  .delete("/:id", deletePostHandler);

module.exports = router;
