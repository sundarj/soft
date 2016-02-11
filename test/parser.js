const soft = require('..')
const tap = require('tap')

const case1 = ' <h1 :is="thing"><!--&self;--><b class="bold">bar</b></h1>'
const case2 = '<h1 :is="thing" :as="helper"></h1>hello<p class="things-thing" id="things-&self;" :of="things"></p>'


console.log('lexer')

tap.deepEqual(
  soft.lex(case1),
  [
    '  ',
    {
      t: 'h1',
      a: {
        ':is': '"thing"'
      }
    },
    '<!--',
    {
      t: 'e',
    },
    '-->',
    {
      t: 'b',
      a: {
        'class': '"bold"'
      },
    },
    'bar',
    {
      t: 'c'
    },
    {
      t: 'c'
    }
  ]
)

tap.deepEqual(
  soft.lex(case2),
  [
    {
      t: 'h1',
      a: {
        ':is': '"thing"',
        ':as': '"helper"',
      }
    },
    {
      t: 'c'
    },
    'hello',
    {
      t: 'p',
      a: {
        'class': '"things-thing"',
        'id': '"things-&self;"',
        ':of': '"things'
      }
    },
    {
      t: 'c'
    }
  ]
)


console.log('parser')

tap.deepEqual(
    soft.parse(case1),
    [
      ' ',
      {
        t: 'h1',
        a: {},
        c: [
          '<!--',
          {
            i: 'thing',
          },
          '-->',
          {
            t: 'b',
            a: {
              class: 'bold'
            },
            c: [
              'bar'
            ]
          }
        ]
      }
  ]
)

tap.deepEqual(
    soft.parse(case1),
    [
      {
        t: 'h1',
        a: {},
        c: [
          {
            i: 'thing',
            h: 'helper'
          }
        ]
      },
      {
        t: 'p',
        a: {
          class: 'things-thing',
          id: [
            'things-',
            {
              i: 'things'
            }
          ]
      },
      c: [
        {
          i: 'things'
        }
      ]
    }
  ]
)