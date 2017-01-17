var google = require('googleapis');
var http = require('http');
var express = require('express');
const Speech = require('@google-cloud/speech');
var app = express();
var bodyParser = require('body-parser')
var request = require('request');
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
  console.log('redirected to recognise')

  function syncRecognize (base64) {
    const speech = Speech();

    const config = {
      encoding: 'LINEAR16',
      sampleRate: 16000
    };

    return speech.recognize('audio.raw', config)
      .then((results) => {
        const transcription = results[0];
        console.log(`Transcription: ${transcription}`);
        res.send({transcription: transcription});
      }).catch(function(error) {
        console.log('err')
        res.send('error')
      });
  };

  syncRecognize(req.body.base64);

});

app.listen(3000);


// app.post('/authenticate', function(req, res) {

//   //retreive authClient
//   google.auth.getApplicationDefault(function(err, authClient) {
//     if (authClient.createScopedRequired && authClient.createScopedRequired()) {
//       authClient = authClient.createScoped(
//         ['https://www.googleapis.com/auth/cloud-platform']
//       );
//     }

//     if (err) {
//       console.log(err);
//     }

//     console.log(authClient)
//     // syncRecognize(req.body.base64, authClient);
//   });
// });

  // function syncRecognize (base64) {
  //   const speech = Speech();

  //   const url = "https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=" + process.env.KEY;

  //   const body = JSON.stringify({
  //         'config': {
  //             'encoding': 'LINEAR16',
  //             'sampleRate': 16000,
  //             'languageCode': 'en-US',
  //         },
  //         'audio': {
  //             'content': base64
  //             }
  //         })

  //   const options = {
  //     uri: url,
  //     oauth: authClient,
  //     'content-type': 'application/json',
  //     body: body
  //   }

  //   request.post(options, function(err, response, body){
  //     // console.log(response)
  //   });


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


  // console.log('req',req.body.base64);

  // service = get_speech_service()
  // service.speech().syncrecognize(
  //     body={
  //         'config': {
  //             'encoding': 'LINEAR16',
  //             'sampleRate': 16000,
  //             'languageCode': 'en-US',
  //         },
  //         'audio': {
  //             'content': req.body.base64
  //             }
  //         }
  // ).then((results) => {
  //   const transcription = results[0];
  //   console.log(`Transcription: ${transcription}`);
  // })

  // passport.use(new GoogleStrategy({
  //         clientID: config.GOOGLE_CLIENT_ID,
  //         clientSecret: config.GOOGLE_CLIENT_SECRET,
  //         callbackURL: config.GOOGLE_CALLBACK_URL
  //     },
  //     function(accessToken, refreshToken, profile, done) {
  //         process.nextTick(function () {
  //             return done(null, profile);
  //         });
  //     }
  // ));

  // app.get('/auth/google', passport.authenticate('google',
  //   { scope: ['https://www.googleapis.com/auth/cloud-platform']}
  // ),
  //   function(req, res){} // this never gets called
  // );

  // app.get('/recognise', passport.authenticate('google',
  //     { successRedirect: '/recognise2', failureRedirect: '/nothing' }
  // ));


//retreive authClient
// google.auth.getApplicationDefault(function(err, authClient) {
//   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
//     authClient = authClient.createScoped(
//       ['https://www.googleapis.com/auth/cloud-platform']
//     );
//   }

//   if (err) {
//     // console.log(err);
//   }

//   console.log(authClient)