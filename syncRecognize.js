const Speech = require('@google-cloud/speech');

module.exports = {

  syncRecognize: function(filename) {
    const speech = Speech();

    const config = {
      encoding: 'LINEAR16',
      sampleRate: 16000
    };

    return speech.recognize(filename, config)
      .then((results) => {
        return {transcription: results[0]};
      }).catch(function(error) {
        return {error: error};
    });;
  }

}