const soft = require('./soft.js')

console.log(JSON.stringify(
  soft.parse(require('fs').readFileSync(__dirname + '/../test/deps/soft.tpl.html', 'utf8'))
 , null, 2))
