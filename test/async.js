const soft = require('..')
const tap = require('tap')

const data = require('./deps/data')

console.log('callback')

tap.equal(
    soft.render('<h1 :is="callback"></h1>', data),
    '<h1>peekaboo</h1>'
)


console.log('promise')

tap.equal(
    soft.render('<h1 :is="promise" class="foo bar baz" data-yes></h1>', data),
    '<h1 class="foo bar baz" data-yes>peekaboo</h1>'
)