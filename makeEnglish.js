"use strict"
const request = require("request")
const getLanguage = require("./getLanguage")
const supportedForeignLanguages = ["es","de"]

// This function will convert the incoming non-english from avatar user to english text and return the same.
function makeEnglish(msg, callback){

  getLanguage(msg, (err, lang)=>{
    if(err) callback(err)
    else {
      if(lang == "en"){
        callback(null, "en", msg)
      }
      else if(supportedForeignLanguages.includes(lang)) {

        let translate_options = {
          url: 'http://149.202.214.34:5000/translate?',
          form: {
            sentence: msg,
            from_lang: lang,
            to_lang : 'en'
          }
        }
        request.post(translate_options, function(err, res){
          if(err) callback(err)
          else {
            try {
              let translated = JSON.parse(res.body)
              let english_msg = translated.Output
              callback(null, lang, english_msg)
            } catch(e) {
              callback(e)
            }
          }
        })
      }
      else {
        callback(null, null, msg)
      }
    }
  })
}

module.exports = makeEnglish
