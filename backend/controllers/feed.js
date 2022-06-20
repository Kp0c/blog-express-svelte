exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        postId: '1',
        title: 'Post 1',
        body: 'This is the body of post 1',
      }
    ]
  });
}

exports.postPost = (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  res.status(201).json({
    message: 'Post created successfully',
    post: {
      title,
      body,
    }
  });
}
