var http = require('http');
var express = require('express');
const Speech = require('@google-cloud/speech');
var app = express();
require('dotenv').config();
app.use(express.static(__dirname));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/recognise', function(req, res) {
  function syncRecognize (filename) {
    const speech = Speech();

    const config = {
      encoding: 'LINEAR16',
      sampleRate: 16000
    };

    return speech.recognize(filename, config)
      .then((results) => {
        const transcription = results[0];
        console.log(`Transcription: ${transcription}`);
        res.send({transcription: transcription});
      }).catch(function(error) {
        res.send('error')
      });
  };

  syncRecognize('audio.raw');

  // function streamingMicRecognize () {
  //   const speech = Speech();

  //   const options = {
  //     config: {
  //       encoding: 'LINEAR16',
  //       sampleRate: 16000
  //     }
  //   };

  //   const recognizeStream = speech.createRecognizeStream(options)
  //     .on('error', console.error)
  //     .on('data', (data) => {
  //       console.log(data.results)
  //       // process.stdout.write(data.results)
  //     });

  //   record.start({ sampleRate: 16000 }).pipe(recognizeStream);

  //   console.log('Listening, press Ctrl+C to stop.');
  // }
});

app.listen(3000);