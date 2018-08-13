# Everlife AI

This is the brain of your avatar - it understands your chats, schedules
work, and responds to you.


## Configuration

The base node has a 'simple' brain to which we can add Artificial
Intelligence via HTTP services. Multiple services can be added into a
`brains.json` file that contains a javascript array of
[request options](https://github.com/request/request#requestoptions-callback)

### Sample brains.json
```js
[
    {
        "uri": "http://localhost:8080/everlife_ai_chat/v1/actions/get_response",
        "method": "POST",
        "json": {
            "context": ["{{context}}"]
        }
    }
]
```


