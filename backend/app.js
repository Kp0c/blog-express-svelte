const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require("dotenv");
const path = require("path");
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const auth = require('./middlewares/auth');

const app = express();

dotenv.config();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '.') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/data/images', express.static(path.join(__dirname, 'data/images')));

// set CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Connection');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(auth);

app.post('/post-image', async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      message: 'Not authorized'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  res.status(201).json({
    message: 'File uploaded successfully',
    imageUrl: req.file.path
  });
});

app.use('/graphql', graphqlHTTP((req, res) => ({
  schema: require('./graphql/schema'),
  rootValue: require('./graphql/resolvers'),
  graphiql: true,
  customFormatErrorFn: error => {
    if (!error.originalError) {
      return error;
    }

    const message = error.message ?? 'An error occurred.';
    const code = error.originalError.statusCode ?? 500;

    res.status(code);

    return {
      message: message,
      status: code
    }

  }
})));

app.use((req, res, next, err) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
  });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URL);

  app.listen(8080);
}

start()
  .then(() => console.log('Server started'))
  .catch(err => console.log(err));
