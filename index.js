'use strict'
const cote = require('cote')
const fs = require('fs')
const u = require('elife-utils')
const request = require('request')


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

    cfg.brains = loadAIProcessorTpls()

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
function loadAIProcessorTpls() {
    try {
        return fs.readFileSync('brains.json', 'utf8')
    } catch(e) {
        if(e.code != 'ENOENT') u.showErr(e)
        return "[]"
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
    let ais = loadAIProcessors(req, cfg.brains);
    get_response_from_1(0)

    function get_response_from_1(ndx) {
        if(!ais || ndx >= ais.length) {
            get_simple_response_1(req.msg)
        } else {

            var options = ais[ndx];
            options['timeout'] = cfg.AI_REQ_TIMEOUT;

            request(options, (err, resp, body) => {
                if(err) get_response_from_1(ndx+1)
                else {
                    // TODO: extract responses from various ai formats
                    if(body.response) cb(null, body.response)
                    else cb(null, body)
                }
            })
        }
    }

    /*      outcome/
     * Default to trying to handle the user request with some basic
     * level of intelligence (which still is pretty useful)
     * TODO: Parse the response and try to respond intelligently to
     * various cases.
     */
    function get_simple_response_1(msg) {
        if(msg == "hi") cb(null, "Hi! How's it going?")
        else cb()
    }
}

/*      problem/
 * We need to send the user's message to various AI's in the format's
 * that they require.
 * 
 *      way/
 * We specify all the AI requests as a JSON array that contains the
 * pattern
 *      `{{context}}`
 * wherever the current messages (and a few previous messages for
 * context) are required by the AI.
 * TODO: Send previous messages for context
 */
function loadAIProcessors(req, tpls) {
    let aiprocessors = tpls.replace("{{context}}",JSON.stringify([req.msg]));
    try {
        return JSON.parse(aiprocessors)
    } catch(e) {
        u.showErr(e)
        return []
    }
}

main()

