const request = require('request')

// This function will get the language of the message entered by avatar user.
function getLanguage(msg, callback) {
    let options = {
        url: 'http://149.202.214.34:4001/language_detect?',
        form: { msg }
    }
    request.post(options, function(err,res) {
        if(err) callback(err)
        else {
            try{
                let out = JSON.parse(res.body)
                callback(null,out.lang)
            } catch(e){
                if(res.body) callback(res.body)
              else callback(e)
            }
        }
    })
}

module.exports = getLanguage
