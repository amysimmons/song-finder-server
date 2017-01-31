const Speech = require('@google-cloud/speech');
const google = require('googleapis');
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser')
const express = require('express');
const fs = require('fs');
const app = express();
const recognise = require('./syncRecognize.js');
require('dotenv').config();

app.use(express.static(__dirname));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/recognise', function(req, res) {

  fs.writeFile("out.raw", req.body.base64, 'base64', function(err) {
    if(err){
      console.log(err);
    }else {
      recognise.syncRecognize('audio.raw').then((result) => {
        console.log(result);
        res.send(result);
      })
    }
  });

});

app.post('/findsongs', function(req, res) {

  var url = 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_lyrics=' +
  req.body.transcription +
  '&quorum_factor=1&apikey=' +
  process.env.MUSIXMATCH_KEY

  request(url, function(err, response, body){
    if (!err && response.statusCode == 200) {
      console.log(body);
      res.send(body);
    } else {
      console.log(err, response);
    }
  });

});

app.listen(3000);