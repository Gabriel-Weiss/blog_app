const asyncHandler = require("express-async-handler");
const {
  findAll,
  findById,
  findByTitle,
  deleteById,
  createPost,
  updatePost,
} = require("../repository/postRepo");

const getPostsHandler = asyncHandler(async (req, res) => {
  const posts = await findAll();
  if (!posts?.length) {
    return res.status(400).json({ message: "Posts not found" });
  }

  return res.json(posts);
});

const getPostHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = findById(id);

  if (!post) {
    return res.status(400).json({ message: "Post not found" });
  }

  return res.json(post);
});

const createPostHandler = asyncHandler(async (req, res) => {
  const { title, content, authorId, isHidden } = req.body;
  if (!title || !content || !authorId) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  const duplicate = await findByTitle(title);

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate title post." });
  }
  const postObject = !isHidden
    ? { title, content, authorId }
    : { title, content, authorId, isHidden };

  const created = await createPost(postObject);

  if (created) {
    res.status(201).json({
      message: `Post ${postObject.title} created successfully`,
    });
  } else {
    res.status(400).json({
      message: `Post ${postObject.title} could not be created`,
    });
  }
});

const updatePostHandler = asyncHandler(async (req, res) => {
  const { title, content, authorId, isHidden } = req.body;
  const { id } = req.params;

  if (!title || !content || !authorId) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  const post = await findById(id);

  if (!post) {
    return res.status(400).json({ message: "Post not found." });
  }
  const duplicate = await findByTitle(title);

  if (duplicate && duplicate?.id !== id) {
    return res.status(409).json({ message: "Duplicate post title." });
  }

  post.title = title;
  post.content = content;
  post.authorId = authorId;

  if (isHidden) {
    post.isHidden = isHidden;
  }

  const updatedPost = await updatePost(post, id);

  res.json({ message: `Post ${updatedPost.title} updated successfully` });
});

const deletePostHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = findById(id);

  if (!post) {
    return res.status(400).json({ message: "Post not found" });
  }

  const deletedPost = await deleteById(id);

  res.json({ message: `Post ${deletedPost.title} deleted successfully` });
});

module.exports = {
  getPostsHandler,
  getPostHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
};
