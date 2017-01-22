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

app.listen(3000);