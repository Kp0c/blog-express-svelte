exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'Post 1',
        content: 'This is the body of post 1',
        imageUrl: 'images/cat.jpg',
        creator: {
          name: 'John Doe',
        },
        createdAt: '2019-01-01T00:00:00.000Z',
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
