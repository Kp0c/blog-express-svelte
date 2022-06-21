const express = require('express');
const feedController = require('../controllers/feed');
const {body} = require("express-validator");

const router = express.Router();

const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
]

router.get('/posts', feedController.getPosts);

router.post(
  '/posts',
  postValidation,
  feedController.postPost
);

router.get('/posts/:postId', feedController.getPost);

router.put('/posts/:postId', postValidation, feedController.putPost);

module.exports = router;
