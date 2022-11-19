const Post = require("../models/Post");

const findAll = () => {
  return Post.findAll();
};

const findById = (id) => {
  return Post.findByPk(id);
};

const findByTitle = (title) => {
  return Post.findOne({ where: { title: title } });
};

const deleteById = (id) => {
  return Post.destroy({ where: { id: id } });
};

const createPost = (post) => {
  var newPost = new Post(post);
  return newPost.save();
};

const updatePost = (post, id) => {
  const updatedPost = {
    title: post.title,
    content: post.content,
    isHidden: post.isHidden,
  };
  return Post.update(updatedPost, { where: { id: id } });
};

module.exports = {
  findAll,
  findById,
  findByTitle,
  deleteById,
  createPost,
  updatePost,
};
