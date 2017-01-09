'use strict';

const Speech = require('@google-cloud/speech');

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
      return transcription;
    });
}

function asyncRecognize (filename) {
  const speech = Speech();

  const config = {
    encoding: 'LINEAR16',
    sampleRate: 16000
  };

  return speech.startRecognition(filename, config)
    .then((results) => {
      const operation = results[0];
      return operation.promise();
    })
    .then((transcription) => {
      console.log(`Transcription: ${transcription}`);
      return transcription;
    });
}

const fs = require('fs');

function streamingRecognize (filename, callback) {
  const speech = Speech();

  const options = {
    config: {
      encoding: 'LINEAR16',
      sampleRate: 16000
    }
  };

  const recognizeStream = speech.createRecognizeStream(options)
    .on('error', callback)
    .on('data', (data) => {
      console.log('Data received: %j', data);
      callback();
    });

  fs.createReadStream(filename).pipe(recognizeStream);
}

const record = require('node-record-lpcm16');

function streamingMicRecognize () {
  const speech = Speech();

  const options = {
    config: {
      encoding: 'LINEAR16',
      sampleRate: 16000
    }
  };

  const recognizeStream = speech.createRecognizeStream(options)
    .on('error', console.error)
    .on('data', (data) => {
      console.log(data.results)
      // process.stdout.write(data.results)
    });

  record.start({ sampleRate: 16000 }).pipe(recognizeStream);

  console.log('Listening, press Ctrl+C to stop.');
}

require(`yargs`)
  .demand(1)
  .command(
    `sync <filename>`,
    `Detects speech in an audio file.`,
    {},
    (opts) => syncRecognize(opts.filename)
  )
  .command(
    `async <filename>`,
    `Creates a job to detect speech in an audio file, and waits for the job to complete.`,
    {},
    (opts) => asyncRecognize(opts.filename)
  )
  .command(
    `stream <filename>`,
    `Detects speech in an audio file by streaming it to the Speech API.`,
    {},
    (opts) => streamingRecognize(opts.filename, () => {})
  )
  .command(
    `listen`,
    `Detects speech in a microphone input stream.`,
    {},
    streamingMicRecognize
  )
  .example(`node $0 sync ./resources/audio.raw`)
  .example(`node $0 async ./resources/audio.raw`)
  .example(`node $0 stream ./resources/audio.raw`)
  .example(`node $0 listen`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/speech/docs`)
  .help()
  .strict()
  .argv;