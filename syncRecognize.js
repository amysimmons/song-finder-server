const SpeechV1beta1 = require('@google-cloud/speech/src/v1beta1')

module.exports = {
  syncRecognize: function(base64Encoding) {
    const speechV1beta1 = SpeechV1beta1();
    const client = speechV1beta1.speechClient();

     const body = {
         "config": {
           "encoding":"LINEAR16",
           "sampleRate":16000,
           "languageCode":"en-US"
         },
         "audio": {
            "content" : base64Encoding
         }
       }

    return client.syncRecognize(body)
      .then((results) => {
        return {transcription: results[0]};
      }).catch(function(error) {
        console.log('error', error)
        return {error: error};
    });;
  }
}
