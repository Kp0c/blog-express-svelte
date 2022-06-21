const {validationResult} = require("express-validator");
const Post = require('../models/post');
const {deleteFile} = require("../util/file");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts
    });
  } catch (err) {
    next(err);
  }
}

exports.postPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array().map(error => error.msg).join(', '),
    });
  }

  if (!req.file) {
    return res.status(422).json({
      message: 'Image is required',
    });
  }

  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
      creator: {name: 'Fix me'},
    })

    await post.save();


    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (err) {
    next(err);
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params['postId']);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.status(200).json({
      message: 'Post fetched successfully',
      post
    });
  } catch (err) {
    next(err);
  }
}

exports.putPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array().map(error => error.msg).join(', '),
      });
    }

    const post = await Post.findById(req.params['postId']);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    post.title = req.body.title;
    post.content = req.body.content;

    if (req.file) {
      deleteFile(post.imageUrl).catch(err => console.error(err));
      post.imageUrl = req.file.path.replace();
    }

    await post.save();

    res.status(200).json({
      message: 'Post updated successfully',
      post
    });
  } catch (err) {
    next(err);
  }
}
