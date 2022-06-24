const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const {deleteFile} = require("../util/file");

module.exports = {
  createUser: async ({user}, req) => {
    const {name, email, password} = user;

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push('Invalid email');
    }

    if (!validator.isLength(password, {min: 4})) {
      errors.push('Password must be at least 4 characters');
    }

    if (validator.isEmpty(name)) {
      errors.push('Name is required');
    }

    if (errors.length > 0) {
      const error = new Error(errors.join('. '));
      error.statusCode = 422;
      throw error;
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      },
    );

    return {
      ...newUser._doc,
      _id: newUser._id.toString(),
      token,
    };
  },
  login: async ({email, password}, req) => {
    const user = await User.findOne({email});

    if (!user) {
      const error = new Error('User or password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('User or password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      },
    );

    return {
      ...user._doc,
      _id: user._id.toString(),
      token,
    };
  },
  posts: async ({page}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const itemsPerPage = 5;
    const pageToFetch = page ?? 1;

    const posts = await Post.find()
      .skip((pageToFetch - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({createdAt: -1})
      .populate('creator');

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / itemsPerPage);

    return {
      posts,
      totalPages,
    };
  },
  createPost: async ({title, content, imageUrl}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    if (validator.isEmpty(title)) {
      const error = new Error('Title is required');
      error.statusCode = 422;
      throw error;
    }

    if (validator.isEmpty(content)) {
      const error = new Error('Content is required');
      error.statusCode = 422;
      throw error;
    }

    if (!imageUrl) {
      const error = new Error('Image is required');
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });

    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    return {
      ...post._doc,
      creator: {
        _id: user._id.toString(),
        name: user.name,
      }
    }
  },
  post: async ({id}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const post = await Post.findById(id).populate('creator');

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    return post;
  },
  editPost: async ({id, title, content, imageUrl}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const post = await Post.findById(id).populate('creator');

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    if (!post.creator._id.equals(req.userId)) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    post.title = title;
    post.content = content;

    if (imageUrl) {
      deleteFile(post.imageUrl).catch(err => console.log(err));
      post.imageUrl = imageUrl;
    }

    await post.save();

    return post;
  },
  deletePost: async ({id}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }

    if(!post.creator.equals(req.userId)) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    deleteFile(post.imageUrl).catch(err => console.log(err));
    await post.remove();

    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();

    return true;
  },
  status: async ({}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    return user.status;
  },
  updateStatus: async ({status}, req) => {
    if (!req.userId) {
      const error = new Error('Not authenticated');
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(req.userId);
    user.status = status;
    await user.save();

    return user.status;
  }
}
