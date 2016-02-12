const soft = require('..')
const tap = require('tap')

const case1 = '  <h1 :is="thing"><!--&self;--><b class="bold">bar</b></h1>'
const case2 = '<h1 :is="thing" :as="helper"></h1>hello<p class="things-thing" id="things-&self;" :of="things"></p>'
const case3 = '  sup it\'s <h1>hello <b class="totally">tubular</b></h1><p>caterpillars</p>  '

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
    '<!--&self;-->',
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
        ':of': '"things"'
      }
    },
    {
      t: 'c'
    }
  ]
)

tap.deepEqual(
  soft.parse(case1),
  [
    '  ',
    {
      t: 'h1',
      a: {},
      c: [
        '<!--',
        {
          i: 'thing'
        },
        '-->',
        {
          t: 'b',
          a: {
            class: '"bold"'
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
  soft.parse(case2),
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
    'hello',
    {
      t: 'p',
      a: {
        class: '"things-thing"',
        id: [
          '"things-"',
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

tap.deepEqual(
  soft.parse(case3),
  [
    '  sup it\'s ',
    {
      t: 'h1',
      a: {},
      c: [
        'hello ',
        {
          t: 'b',
          a: {
            class: '"totally"'
          },
          c: [
            'tubular'
          ]
        }
      ]
    },
    {
      t: 'p',
      a: {},
      c: [
        'caterpillars'
      ]
    }
  ]
)
