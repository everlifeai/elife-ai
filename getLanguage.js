/**
 * This function used for deteing the language for given message
 * if any error or exception default language will english
 * else return the detected language
 */
const request = require('request')

function getLanguage(req, callback){
    let options = {
        url: 'http://149.202.214.34:4001/language_detect?',
        form: {
            msg: req.msg,
        }
    };
    request.post(options, function(err,res){
        if(err) {
            console.log(err)
            callback(null,req.lang)
        }

        else {
            try{
                console.log(res.body)
                let out = JSON.parse(res.body)

                req.lang = out.lang
                callback(null,req.lang)
            }catch(e){
                console.error(e)
                callback(null, "en")
            }

        }
    })
}

module.exports = getLanguage
