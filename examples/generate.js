'use strict'

let Consumer = require('carrot-consumer')

let options = {
    queueName: 'data.spigot'
}

let generator = new Consumer(options)

generator.spread(function(consumer,queue) {

    for (var i = 0; i < 3000; i++) {
        queue.publish('data.spigot', Math.random() * 10000)
    }

})
