const express = require('express');
const feedController = require('../controllers/feed');
const {body} = require("express-validator");

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post(
  '/posts',
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  feedController.postPost
);

router.get('/posts/:postId', feedController.getPost);

module.exports = router;
