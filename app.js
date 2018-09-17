const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
//process.env.MONGO_ATLAS_PW
mongoose.connect('mongodb+srv://atman-darji:'+ process.env.MONGO_ATLAS_PW +'@cluster0-dq7xd.mongodb.net/test?retryWrites=true',{
  useNewUrlParser: true
});
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

const userRouts = require('./api/routs/user');
const searchRouts = require('./api/routs/search');
const verifyRouts = require('./api/routs/verify');

app.get('/', (req,res)=>{
  res.send("Welcome to the musicrec-server!");
});

app.use('/search',searchRouts);
app.use('/user',userRouts);
app.use('/verify',verifyRouts);

app.use((req, res, next) => {
  const error = new Error('Not fund');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
