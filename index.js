'use strict'
const cote = require('cote')
const u = require('elife-utils')


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
    return cfg;
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
        cb("TODO: Get response from cakechat")
    })

}

main()

