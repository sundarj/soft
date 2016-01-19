const soft = require('..')
const tap = require('tap')
const data = require('./deps/data')

console.log('render with no data')

const s = '<h1>some string, template need not apply</h1>'
tap.equal( soft.render(s), s )
tap.equal( soft.render(s, data), s )