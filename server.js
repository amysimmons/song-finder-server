const Speech = require('@google-cloud/speech');
const google = require('googleapis');
const http = require('http');
const request = require('request');
const rp = require('request-promise');
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

  const url1 = 'https://api.musixmatch.com/ws/1.1/track.search?format=json&callback=callback&q_lyrics=' +
  req.body.transcription +
  '&quorum_factor=1&apikey=' +
  process.env.MUSIXMATCH_KEY

  var a = rp(url1)
    .then(response => {
      const songData = JSON.parse(response);
      const songMatches = songData.message.body.track_list;
      const firstSongMatch = songMatches[0].track;
      const youtubeQuery = firstSongMatch.track_name + " " + firstSongMatch.artist_name

      const url2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" +
      encodeURIComponent(youtubeQuery) +
      "&safeSearch=moderate&type=video&videoEmbeddable=true&key=" +
      process.env.GOOGLE_SPEECH_KEY

      return {songMatches, url2};
    });

  var b = a.then(function(resultA) {

    rp(resultA.url2)
      .then(response => {

        const videoData = JSON.parse(response);
        const videoIds = videoData.items.map(function(video){
          return video.id.videoId
        });

        const result = {
          otherLyricMatches: resultA.songMatches,
          bestMatchVideo: videoIds[0]
        };

        res.send(result);

        return result;
      })

  }).catch(err => console.log('hello', err)) // Don't forget to catch errors

});

app.listen(3000);