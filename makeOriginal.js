"use strict"
const request = require("request")

// This function will convert the english response from elife-ai to the original language that the avatar user had given.
function makeOriginal(lang, msg, callback) {
    let translate_options = {
      url: 'http://149.202.214.34:5000/tooriginal?',
      form: {
        sentence: msg,
        toLang : lang
      }}
    request.post(translate_options, function(error,result) {
      if(error || (result.statusCode == 404)){
        callback(error, msg)
      } else {
          try {
            let translated = JSON.parse(result.body)
            let translated_msg = translated.Output
            callback(null,translated_msg)
          } catch(e) {
            callback(e, msg)
          }
      }
    })
  }   

module.exports = makeOriginal
