const soft = require('..')
const tap = require('tap')

const data = require('./deps/data.json')

console.log('[:is]')
tap.equal(
    soft.render('<h1 :is="thing"></h1>', data),
    '<h1>i am thing</h1>'
)

console.log('[:is] with other attributes')
tap.equal(
    soft.render('<h1 :is="thing" class="foo bar baz" data-yes></h1>', data),
    '<h1 class="foo bar baz" data-yes>i am thing</h1>'
)