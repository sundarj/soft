const soft = require('..')
const tap = require('tap')

console.log('autoclose tags')

tap.equal(
    soft.render('<h1>'),
    '<h1></h1>'
)

tap.equal(
    soft.render('<h1>foo'),
    '<h1>foo</h1>'
)

tap.equal(
    soft.render('<h1>foo<b>bar'),
    '<h1>foo<b>bar</b></h1>'
)


console.log('but not with [:void]')

tap.equal(
    soft.render('<img :void>'),
    '<img>'
)

tap.equal(
    soft.render('<img :void>foo'),
    '<img>foo'
)