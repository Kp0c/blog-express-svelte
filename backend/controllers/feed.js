const {validationResult} = require("express-validator");
const Post = require('../models/post');

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

  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: '/images/image1.jpg',
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
