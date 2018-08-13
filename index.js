'use strict'
const cote = require('cote')
const fs = require('fs')
const u = require('elife-utils')
const request = require('request')
const Mustache = require('mustache')


/*      understand/
 * This is the main entry point where we start.
 *
 *      outcome/
 * Load any configuration information and wake up the brain.
 */
function main() {
    let conf = loadConfig()
    wakeUpAI(conf)
}

/*      outcome/
 * Load the configuration (from environment variables) or defaults
 */
function loadConfig() {
    let cfg = {};

    if(process.env.AI_REQ_TIMEOUT) {
        cfg.AI_REQ_TIMEOUT = process.env.AI_REQ_TIMEOUT
    } else {
        cfg.AI_REQ_TIMEOUT = "500"
    }

    cfg.brains = loadAIProcessors()

    return cfg;
}

/*      problem/
 * We would liket the Avatar to able to get 'smarter' as it grows older.
 *
 *      way/
 * The default AI responses are pretty simple and so we allow it to
 * 'call out' to an external service (an additional "brain module" so to
 * speak) to perhaps get a better response.
 * There can be an array of such responses AI's available via HTTP
 * requests. We try the first, then move on to the second and so on.
 * This array is mantained in a `brains.json` file.
 *
 * TODO: Detail the request/response format so responses can activate
 * skills, add tasks, and so on.
 */
function loadAIProcessors() {
    try {
        return JSON.parse(fs.readFileSync('brains.json', 'utf8'))
    } catch(e) {
        u.showErr(e)
        return []
    }
}


function wakeUpAI(cfg) {

    /*      understand/
     * The ai microservice (partitioned by key `everlife-ai-svc` to
     * prevent conflicting with other services.
     */
    const aiSvc = new cote.Responder({
        name: 'Everlife AI Service',
        key: 'everlife-ai-svc',
    })


    /*      outcome/
     * Responds to a request for a chat response
     */
    aiSvc.on('get-response', (req, cb) => {
        getResponse(cfg, req, cb)
    })

}

/*
 *      problem/
 * The Avatar needs to respond to the user intelligently
 *
 *      way/
 * We 'call out' for responses to various modules - starting from what
 * we think would be most helpful and moving methodically through the
 * list until, at last, we default to some simple response we can
 * handle here by default.
 */
function getResponse(cfg, req, cb) {
    get_response_from_1(0)

    function get_response_from_1(ndx) {
        if(!cfg.brains || ndx >= cfg.brains.length) {
            get_simple_response()
        } else {

            var options = addReqData(req,cfg.brains[ndx]);
            options['timeout'] = cfg.AI_REQ_TIMEOUT;
            
            request(options, (err, resp, body) => {
                if(err) get_response_from_1(ndx+1)
                else cb(null, body)
            })
        }
    }

    /*      outcome/
     * Default to trying to handle the user request with some basic
     * level of intelligence (which still is pretty useful)
     * TODO: Parse the response and try to respond intelligently to
     * various cases.
     */
    function get_simple_response() {
        cb(null, "I'm sorry - I seem to be having trouble understanding you right now")
    }
}

/*      outcome/
 *   Updating the options object with user requested data. 
 * 
 */
function addReqData(req, opts) {
    
    opts = Mustache.render(JSON.stringify(opts), {context: req.context});

    return JSON.parse(opts)
}

function processRespData(resp) {
    // TODO: take the response data and convert into tasks etc
    return resp
}

main()

