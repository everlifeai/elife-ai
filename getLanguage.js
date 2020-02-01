const request = require('request')

// This function will get the language of the message entered by avatar user.
function getLanguage(req, callback) {
    let options = {
        url: 'http://149.202.214.34:4001/language_detect?',
        form: {
            msg: req.msg,
        }
    }
    request.post(options, function(err,res) {
        if(err) {
            console.error(err)
            req.lang =  "en"
            callback(null,req.lang)
        } else {
            try{
                let out = JSON.parse(res.body)
                req.lang = out.lang
                callback(null,req.lang)
            }catch(e){
                console.error(e)
                callback("Sorry! Failed to fetch the language")
            }
        }
    })
}

module.exports = getLanguage
