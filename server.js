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

app.set('jsonp callback name', 'callback');

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
  var url = 'https://api.musixmatch.com/ws/1.1/track.search?format=json&callback=callback&q_lyrics=' +
  req.body.transcription +
  '&quorum_factor=1&apikey=' +
  process.env.MUSIXMATCH_KEY

  request(url, function(err, response, body){
    if (!err && response.statusCode == 200) {


      res.send(body);

      var data = json.parse(body)

      var title = encodeURIComponent(data.message.body.track_list[0].track.track_name);
      var artist = encodeURIComponent(data.message.body.track_list[0].track.artist_name);

      res.redirect(200, '/mainsong=' + title + artist);
    } else {
      console.log('err', err, 'response', response);
    }
  });
});

app.post('/mainsong', function(req, res) {
  console.log('in main song')
  console.log(req.query.valid)
  console.log(req.params);
});

app.listen(3000);