/**
 * @license MIT Copyright 2018 Ayoub Chouak
 *  
 */

'use strict'

var seneca = require('seneca')()

seneca.add('role: util, cmd: reduce', (msg, respond) => {
    
    return respond(null, { result: reduce(msg.list) })

    function reduce(list) {
        return list.reduce((x, y) => x + y)
    }
})
.add('role: util, cmd: reduce', function (msg, respond) { 

    let seneca = this

    if (msg.list.length > 0) {

        if (Object.getPrototypeOf(msg.list[0]) != Object.getPrototypeOf({})) {

            return seneca.prior({
                role: 'util',
                cmd: 'reduce',
                list: msg.list
            }, (err, result) => {

                if (err !== null)
                    return respond(err)
                return respond(null, result)
            })
        }

        // Overload case
        return respond(null, { result: reduce(msg.list) })
    }
    else
        return respond(new Error('empty list'))

    function reduce(list) {
        return list.reduce((x, y) => Object.assign(x, y))
    }
})
.add('role: math, cmd: montecarloPi', (msg, respond) => {

    return respond(null, { result: computePiMontecarlo(msg.iters) })

    function computePiMontecarlo(iters) {

        let pointsInsideCount = 0

        for (let i = 0; i < iters; i++) {

            let x = 1.0 * Math.random()
            let y = 1.0 * Math.random()

            if (Math.sqrt(x * x + y * y) <= 1.0)
                pointsInsideCount++
        }

        let pi = 4 * pointsInsideCount / iters

        return pi
    }
})

// Test
seneca.act('role: util, cmd: reduce, list: [\'a\', \'b\']', (_, answer) => console.log(answer.result))
seneca.act('role: math, cmd: montecarloPi, iters: 1000000', (_, answer) => console.log(answer.result))