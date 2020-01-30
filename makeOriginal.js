// This function will convert the english response from elife-ai to the original language that the avatar user had given.
"use strict"
const request = require("request")

function makeOriginal(req,resp,callback){

  if (req.lang == 'es'){
    let translate_options = {
      url: 'http://149.202.214.34:5000/translate?',
      form: {
        sentence: resp,
        from_lang: "en",
        to_lang : 'sp'
      }}
    request.post(translate_options, function(error,result){
      if(error || (result.statusCode == 404)){
        callback(null,req.orig)
      }
      else if(result){
        if(result.body && result.statusCode != 404){
          let translated = JSON.parse(result.body)
          let translated_msg = translated.Output
          callback(null,translated_msg)
        }else callback(null,resp)
      }
    })
  }
  else if(req.lang === "Not Supported"){
    callback(null,req.msg)
  }

}

module.exports = makeOriginal
