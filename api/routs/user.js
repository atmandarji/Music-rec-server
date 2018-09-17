const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifytoken = require('../middleware/verifytoken');

const User = require('../models/user');
const History = require('../models/history');
router.post('/signup', (req, res, next) => {
  User.find({userid: req.body.authData.userid})
  .exec()
  .then(user => {
    if(user.length >= 1){
      return res.status(409).json({
        message: 'User ID already exist'
      });
    }
    else{
      bcrypt.hash(req.body.authData.password, 10, (err, hash) => {
        if(err){
          return res.status(500).json({
              error: err
          });
        }
        else{
          const user = new User({
              _id: new mongoose.Types.ObjectId(),
              userid: req.body.authData.userid,
              password: hash,
              name: req.body.authData.name
            });
            user
            .save()
            .then(result => {
              console.log(result);

              const token = jwt.sign({
                userid: user.userid,
                _uderid: user._id
              },
              process.env.JWT_KEY,
              {
                 expiresIn: "2h"
              });
              return res.status(201).json({
                message: "New user successfully created",
                name: user.name,
                token: token
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error:err
              })
            });
        }
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});
router.post('/login', (req, res, next) => {
  //console.log(req.body);
  User.find({userid: req.body.authData.userid})
  .exec()
  .then(user => {
    if(user.length < 1){
      return res.status(401).json({
        message: "User doesn't exist"
      });
    }
    bcrypt.compare(req.body.authData.password, user[0].password, (err,result) => {
      if(err){
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      if(result){
        //console.log(process.env.JWT_KEY);
        const token = jwt.sign({
          userid: user[0].userid,
          _uderid: user[0]._id
        },
        process.env.JWT_KEY,
        {
           expiresIn: "2h"
        });
        return res.status(200).json({
          message: "Successfully loggen in",
          name: user[0].name,
          token: token
        });
      }
      return res.status(401).json({
        message: "Incorrect password"
      });
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});
router.get('/history', verifytoken, (req, res, next) => {
  History.find({userid: req.headers.uid})
  .exec()
  .then(history => {
    res.status(200).json({
      history: history
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});
router.delete('/history', verifytoken, (req, res, next) => {
  History.remove({userid: req.headers.uid})
  .exec()
  .then(history => {
    res.status(200).json({
      message: 'History deleted'
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
