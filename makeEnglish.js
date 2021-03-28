"use strict"
const request = require("request")

// This function will convert the incoming non-english from avatar user to english text and return the same.
function makeEnglish(msg, callback){
    let translate_options = {
        url: 'http://149.202.214.34:5000/toenglish?',
        form: {
            sentence: msg,
        }
    }
    request.post(translate_options, function(err, res){
        if(err) callback(err)
        else {
            try {
                let translated = JSON.parse(res.body)
                let english_msg = translated.Output
                let lang = translated.lang
                callback(null, lang, english_msg)
            } catch(e) {
                callback(e)
            }
        }
    })
}


module.exports = makeEnglish
