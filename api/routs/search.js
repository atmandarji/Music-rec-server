const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const verifytoken = require('../middleware/verifytoken');
const router = express.Router();
const axios = require("axios");
const request = require("request");

const History = require('../models/history');
router.get('/', verifytoken, (req, res, next) => {
  const uid = req.headers.uid;
  const query = req.param("artist");
  if(query){
    const historyobj = new History({
      _id: new mongoose.Types.ObjectId(),
      userid: uid,
      artist: query
    });
    History.find({userid: uid, artist: query})
    .exec()
    .then(history => {
      if(history.length < 1){
        historyobj.save()
        .then(result => {
          console.log(result);
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    const url = "http://ws.audioscrobbler.com/2.0/";
    let result = {};
    axios.get(url, {
      params :{
        'method': 'artist.gettoptracks',
        'artist': query,
        'api_key': process.env.API_KEY,
        'format': 'json'
      }
    })
    .then(({data}) => {
      result = {
        ...result,
        ...data
      };
      axios.get(url, {
        params :{
          'method': 'artist.getsimilar',
          'artist': query,
          'api_key': process.env.API_KEY,
          'format': 'json'
        }
      })
      .then(({data}) => {
        result = {
          ...result,
          ...data
        };
        res.status(200).json({
          result
        });
      })
      .catch(error => {
        res.status(500).json({
          error: error
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
  }
});

module.exports = router;
