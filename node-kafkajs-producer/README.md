# Node + Kafka app

## Overview

This spins up a simple kafka app that produces and consumes a new message every 5 seconds.
![image](https://github.com/DataDog/datadog-agent/assets/53925869/1d5c736c-fd87-40e3-b50c-6be4a9132cca)


## Instructions

The agent is containerized. Make sure that in your `~` directory, you have a file called sandbox.docker.env that contains:

`DD_API_KEY=<Your API Key>`

This is where the agent will read the API key.

Launch by running

```
docker-compose up -d --build
```

You should see logs indicating messages are being sent and received.

![image](https://github.com/DataDog/sandbox/assets/53925869/e667ef1c-6396-4df2-94fd-d4da71189ad7)

![image](https://github.com/DataDog/sandbox/assets/53925869/4ae408bb-d3c8-4c8f-a84e-ed59726bcf67)

## Tear down

Run `docker-compose down`

## Troubleshooting

If you are receiving connection errors from the producer or consumer, try clearing out the unused volumes in Docker to see if this alleviates the issue

There are no accessible endpoints as this app is simply producing and consuming messages. If you would like to change the rate at which messages are produced, edit the `producer.js` file, in the `setInterval()` function.
