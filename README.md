Carrot-Router
=====

Simple implementation of [carrot-consumer](https://github.com/HotelQuickly/carrot-consumer), for draining queues to no where, moving messages to their starting spot, creating testing / staging flows at percentage of total volume.

Supports
-----
* Passthrough
* Bcc @ percent
* Highly scalable /dev/null


Usage
=====

* `npm i carrot-spigot --save`
* See examples folder

Local Usage / Development
====

* Clone this
* `npm i`
* `node examples/generate.js` give it little bit
* Monitor your queue wait for 3k msgs, kill it
* check / modify options in `examples/router.js`
* run `node examples/router.js`
* repeat the two steps above to your heart's content

Options
------

All options below in Env Variables, are available to configure via their camelCase names, and provided to constructor as per examples folder. Env variables are given precedence.


Env Variables
------

* AMQP_URL - (string) Location of rabbit
* SOURCE_QUEUE_NAME - (string) Probably the single most important variable, where to read messages from.
* DESTINATION_QUEUE_NAME - (string) Where to send %100 of messages, pretty important too.
* BCC_QUEUE_NAME - (string) Name of queue to route bcc messages to.
* ROUTE_BCC - (boolean) Send percentage of total volume to another queue or not. Not as useful as null.
* BCC_PERCENT - (int) Percentage at which to bcc messages if ROUTE_BCC is true.
* ROUTE_NULL - (boolean) Overrides all other routing options. All messages vanish. Super useful.
* PREFETCH - (int) How many messages to prefetch
