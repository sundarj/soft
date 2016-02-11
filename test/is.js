const soft = require('..')
const tap = require('tap')

const data = require('./deps/data')


tap.equal(
    soft.render('<h1 :is="thing"></h1>', data),
    '<h1>i am thing</h1>'
)



tap.equal(
    soft.render('<h1 :is="thing" class="foo bar baz" data-yes></h1>', data),
    '<h1 class="foo bar baz" data-yes>i am thing</h1>'
)



tap.equal(
    soft.render('<h1 :is="thing">did you know &self;</h1>', data),
    '<h1>did you know i am thing</h1>'
)



tap.equal(
    soft.render('<h1 :is="objecthing.bar"></h1>', data),
    '<h1>inside objectthing, bar i be</h1>'
)



tap.equal(
    soft.render('<h1 :is="objecthing">&self.bar -- &self[foo];</h1>', data),
    '<h1>inside objectthing, bar i be -- inside objectthing, foo i be</h1>'
)