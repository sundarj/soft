import parse, { lex } from './parser'
export { parse, lex }

import compile from './compiler'
export { compile }

export function render(body, data){
  return compile(body)(data)
}
