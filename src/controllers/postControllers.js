const asyncHandler = require("express-async-handler");
const { findByName } = require("../repository/userRepo");
const {
  findAll,
  createPost,
  updatePost,
  deleteById,
  findByTitle,
  findAllPublic,
  findAllByAuthor,
} = require("../repository/postRepo");
const UserType = require("../constants/UserType");

//  @description Get all posts by admin and by blogger only public (isHidden:false)
//  @route GET /posts
//  @access public
const getPostsHandler = asyncHandler(async (req, res) => {
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  let posts = [];

  if (!req.type) {
    return res.status(400).json({ message: "Current user undefined" });
  } else if (req.type === UserType.ADMIN) {
    posts = await findAll();
    return res.json(posts);
  } else if (req.type === UserType.BLOGGER) {
    posts = await findAllPublic();
  } else {
    return res.status(500).json({ message: "Something went wrong" });
  }

  if (!posts?.length) {
    return res.status(400).json({ message: "Posts not found" });
  }

  return res.json(posts);
});

//  @description Get all posts by blogger
//  @route GET /posts/self
//  @access private
const getUserPostsHandler = asyncHandler(async (req, res) => {
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  let posts = [];

  if (!req.type) {
    return res.status(400).json({ message: "Current user undefined" });
  } else {
    const user = await findByName(req.name);
    posts = await findAllByAuthor(user.id);
  }

  if (!posts?.length) {
    return res.status(400).json({ message: "Posts not found" });
  }

  return res.json(posts);
});

//  @description Create a post
//  @route POST /posts
//  @access public
const createPostHandler = asyncHandler(async (req, res) => {
  const { title, content, isHidden } = req.body;
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (!req.type && !req.name) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const userFound = await findByName(req.name);

  if (!userFound) {
    return res.status(400).json({ message: "Current user not existent" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  const duplicate = await findByTitle(title);

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate title post." });
  }
  const postObject = !isHidden
    ? { title, content, authorId: userFound.id }
    : { title, content, authorId: userFound.id, isHidden };

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

//  @description Update a post
//  @route PATCH /posts/:id
//  @access public <accessible only by logged users>
const updatePostHandler = asyncHandler(async (req, res) => {
  const { title, content, isHidden } = req.body;
  const { id } = req.params;
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (!req.type && !req.name) {
    return res.status(400).json({ message: "Current user undefined" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "All fields must be provided." });
  }

  const user = await findByName(req.name);

  const posts = await findAllByAuthor(user.id);
  if (!posts.length) {
    return res.status(400).json({ message: "No posts found" });
  }
  const post = posts.find((post) => post.id === parseInt(id));
  console.log(post);

  const duplicateTitle = await findByTitle(title);

  if (duplicateTitle) {
    return res.status(400).json({ message: "Post with this title exists" });
  }

  if (!post) return res.status(400);

  post.title = title;
  post.content = content;
  post.isHidden = isHidden;

  await updatePost(post, id);
  res.json({ message: `Post ${post.title} updated successfully` });
});

//  @description Delete a post
//  @route DELETE /posts/self
//  @access public
//  <accessible only by logged users,
//   bloggers can delete only owning posts,
//   admins can delete owning and any public post (isHidden: false)>
const deletePostHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = { name: req.name, type: req.type };
  // console.log("CurrentUser ", currentUser);

  if (!req.name && !req.type) {
    return res.status(400).json({ message: "Current user undefined" });
  }
  const user = await findByName(req.name);
  let posts;

  if (req.name && req.type === UserType.BLOGGER) {
    posts = await findAllByAuthor(user.id);
  } else if (req.name && req.type === UserType.ADMIN) {
    const publicPosts = await findAllPublic();
    const userPosts = await findAllByAuthor(user.id);
    posts = [...new Set([...publicPosts, ...userPosts])];
    console.log(posts);
  }

  if (!posts.length) {
    return res.status(400).json({ message: "No posts found" });
  }
  const post = posts.find((post) => post.id === parseInt(id));

  if (!post) {
    return res.status(400).json({ message: "Post not found" });
  }

  await deleteById(id);

  res.json({ message: `Post ${post.title} deleted successfully` });
});

module.exports = {
  getPostsHandler,
  getUserPostsHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
};
