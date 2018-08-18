'use strict'
const cote = require('cote')

const client = new cote.Requester({
    name: 'Test Everlife AI Client',
    key: 'everlife-ai-svc',
})

/*      outcome/
 * Exercise the ai chat service by sending it a message
 */
function main() {
    client.send({ type: 'get-response', msg: "Hi" }, (err, r) => {
        if(err) console.error(err)
        else console.log(r)
    })
}

main()
