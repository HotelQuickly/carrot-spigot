'use strict'

let Spigot = require('../'),
    router,
    options

options = {
    bccPercent: 50,
    routeBcc: true,
    bccQueueName: 'data.shadow',
    sourceQueueName: 'data.spigot',
    destinationQueueName: 'data.real',
    queueUrl: 'amqp://localhost',
    prefetch: 30000
}

router = new Spigot(options)

router.catch(onError)

process.on('uncaughtException', onError)

function onError(err) {
    // log / hit pager duty / etc
    console.log(err)
}
