const soft = require('..')
const tap = require('tap')


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



tap.equal(
    soft.render('<img><br>'),
    '<img><br>'
)

tap.equal(
    soft.render('<img>foo<br>'),
    '<img>foo<br>'
)