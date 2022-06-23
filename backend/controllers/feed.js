const {validationResult} = require("express-validator");
const Post = require('../models/post');
const User = require('../models/user');
const socket = require('../util/socket');
const {deleteFile} = require("../util/file");

const ITEMS_PER_PAGE = 5;

exports.getPosts = async (req, res, next) => {
  try {
    const page = req.query['page'] || 1;
    const posts = await Post.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort({createdAt: -1})
      .populate('creator');

    const totalItems = await Post.countDocuments();
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts,
      totalPages
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
      creator: req.userId,
    })

    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    const postResponse = {
      ...post._doc,
      creator: {
        _id: user._id,
        name: user.name,
      }
    };

    socket.getIO().emit('posts', {
      action: 'create',
      post: postResponse
    });

    res.status(201).json({
      message: 'Post created successfully',
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

    const post = await Post.findById(req.params['postId']).populate('creator');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    if (!post.creator.equals(req.userId)) {
      return res.status(403).json({
        message: 'You are not allowed to edit this post',
      });
    }

    post.title = req.body.title;
    post.content = req.body.content;

    if (req.file) {
      deleteFile(post.imageUrl).catch(err => console.error(err));
      post.imageUrl = req.file.path.replace();
    }

    await post.save();

    socket.getIO().emit('posts', {
      action: 'update',
      post
    });

    res.status(200).json({
      message: 'Post updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params['postId']);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    if (!post.creator.equals(req.userId)) {
      return res.status(403).json({
        message: 'You are not allowed to delete this post',
      });
    }

    deleteFile(post.imageUrl).catch(err => console.error(err));
    await Post.deleteOne({_id: req.params['postId']});

    const user = await User.findById(req.userId);

    user.posts.pull(req.params['postId']);

    await user.save();

    socket.getIO().emit('posts', {
      action: 'delete',
      post
    });

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({
      message: 'Status fetched successfully',
      status: user.status,
    });
  } catch (err) {
    next(err);
  }
}

exports.putStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    user.status = req.body.status;

    await user.save();

    res.status(200).json({
      message: 'Status updated successfully',
      status: user.status,
    });
  } catch (err) {
    next(err);
  }
}
