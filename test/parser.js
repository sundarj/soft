const soft = require('..')
const tap = require('tap')

const data = require('./deps/data')

console.log('parser')

tap.deepEqual(
    soft.parse('<h1 :is="thing"><!--&self;--><b class="bold">bar</b></h1>'),
    [
        '<h1',
        '',
        '>',
        '<!--',
        {
            t: 'is',
            i: 'thing'
        },
        '-->',
        '<b class="bold">',
        'bar',
        '</b>',
        '</h1>'
    ]
)

tap.deepEqual(
    soft.parse('<h1 :is="thing" :as="helper"></h1><p class="things-thing" id="things-&self;" :of="things"></p>'),
    [
        '<h1',
        '',
        '>',
        {
            t: 'is',
            i: 'thing',
            h: 'helper'
        },
        '</h1>',
        '<p class="things-thing" id="things-',
        {
            t: 'is',
            i: 'things',
            ix: 0
        },
        '"',
        '>',
        '<p class="things-thing" id="things-',
        {
            t: 'is',
            i: 'things',
            ix: 1
        },
        '"',
        '>',
        '<p class="things-thing" id="things-',
        {
            t: 'is',
            i: 'things',
            ix: 2
        },
        '"',
        '>'
    ]
)