const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // You need this to connect to MongoDB

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tasks';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully on Vercel!');
}).catch(err => {
  console.error('Could not connect to MongoDB:', err);
});

const userRouter = require('./router/Userroute');
app.use('/api', userRouter);

const taskRouter = require('./router/taskRouter');
app.use('/api', taskRouter);

module.exports = app;
