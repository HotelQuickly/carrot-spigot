'use strict'

let Consumer = require('carrot-consumer'),
    Promise = require('bluebird')

function Spigot( opts, ready ) {
    if ( !process.env.SOURCE_QUEUE_NAME || !process.env.DESTINATION_QUEUE_NAME ) {
        if ( !opts.sourceQueueName || !opts.destinationQueueName ){
            throw new Error('Must provide { sourceQueueName: "", destinationQueueName: "" } or configure in environment')
        }
    }

    let queue,
        reader,
        options,
        routeNull,
        routeBcc,
        bccPercent,
        bccPublish,
        bccQueueName,
        sourceQueueName,
        destinationQueueName

    routeNull = process.env.ROUTE_NULL || opts.routeNull
    routeBcc = process.env.ROUTE_BCC || opts.routeBcc
    bccPercent = process.env.BCC_PERCENT || opts.bccPercent
    bccQueueName = process.env.BCC_QUEUE_NAME || opts.bccQueueName
    sourceQueueName = process.env.SOURCE_QUEUE_NAME || opts.sourceQueueName
    destinationQueueName = process.env.DESTINATION_QUEUE_NAME ||  opts.destinationQueueName

    options = {
        onJob: onJob,
        queueName: sourceQueueName,
        pipeName: destinationQueueName,
        prefetch: process.env.PREFETCH || opts.prefetch,
        queueUrl: process.env.AMQP_URL || opts.queueUrl
    }

    reader = new Consumer(options)

    reader.spread(function(consumer, consumerQueue) {
        queue = consumerQueue
        if ( routeBcc && bccQueueName ) {
            queue.createAsync(bccQueueName, { noAck: true })
                .then(onBccCreated)
                .then(function() {
                    ready(null, queue)
                })
                .catch(onError)
        } else {
            ready(null, queue)
        }

    })
    .catch(onError)

    function onBccCreated() {
        bccPublish = function(msg) {
            queue.publish(bccQueueName, msg)
        }
    }

    function onJob(job, ack, destination) {
        // Highly scalable /dev/null
        if ( routeNull ) {
            return ack()
        }
        // send to destination
        destination(job)
        // see if we should bcc
        if ( shouldBcc() && bccPublish ) {
            bccPublish(job)
        }
        ack()
    }

    function shouldBcc() {
        return ~~(Math.random() * 101) <= bccPercent
    }

    function onError(err) {
        console.log(err)
        ready(err, null)
    }

}

module.exports = function createSpigot( opts ) {
    return new Promise(function(resolve, reject) {
        let spigot = new Spigot( opts, ready )

        function ready(err, reader) {
            if (err) {
                return reject(err)
            } else {
                return resolve([spigot, reader])
            }
        }
    })
}
