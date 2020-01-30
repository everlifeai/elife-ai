// This function will convert the incoming non-english from avatar user to english text and return the same.

"use strict"
const request = require("request")
const getLanguage = require("./getLanguage")

function makeEnglish(req,callback){

  getLanguage(req,(err, lang)=>{

    if(err){
      console.error(err)
      callback(null, req.msg)
    }
    else {
      if(lang == "es"){
        let translate_options = {
          url: 'http://149.202.214.34:5000/translate?',
          form: {
            sentence: req.msg,
            from_lang: "sp",
            to_lang : 'en'
          }
        }
        request.post(translate_options, function(error,result){
          if(error || (result.statusCode == 404)){
            console.error(error)
            callback(error,req.msg)
          }
          else if(result.body && result.statusCode != 404){
            let translated = JSON.parse(result.body)
            let english_msg = translated.Output
            callback(null, english_msg)
          }
        })
      }
      else
      { if(req.lang == "en"){
        callback(null,req.msg)
      }else{
        req.lang = "Not Supported"
        callback(null,req.msg)
      }
      }
    }
  })

}

module.exports = makeEnglish
