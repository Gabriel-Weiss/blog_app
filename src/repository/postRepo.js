const Post = require("../models/Post");

const findAll = () => {
  return Post.findAll({
    attributes: ["id", "title", "content", "is_hidden", "authorId"],
    raw: true,
  });
};

const findAllByAuthor = (authorId) => {
  return Post.findAll({
    where: { authorId },
    attributes: ["id", "title", "content", "is_hidden", "authorId"],
    raw: true,
  });
};

const findAllPublic = () => {
  return Post.findAll({
    where: { is_hidden: false },
    attributes: ["id", "title", "content", "is_hidden", "authorId"],
    raw: true,
  });
};

const findByTitle = (title) => {
  return Post.findOne({
    where: { title: title },
    attributes: ["id", "title", "content", "is_hidden", "authorId"],
    raw: true,
  });
};

const deleteById = (id) => {
  return Post.destroy({ where: { id: id } });
};

const createPost = (post) => {
  var newPost = new Post(post);
  return newPost.save();
};

const updatePost = (post, id) => {
  var updatedPost = {
    title: post.title,
    content: post.content,
    isHidden: post.isHidden,
  };
  return Post.update(updatedPost, { where: { id } });
};

module.exports = {
  findAll,
  findAllByAuthor,
  findAllPublic,
  findByTitle,
  deleteById,
  createPost,
  updatePost,
};
