import parse, { lex } from './parser'
export { parse, lex }

import compile from './compiler'
export { compile }

export const CONFIG = {
  prefix: ':'
}

export function configure(options) {
  Object.assign(CONFIG, options)
  
  return soft;
}

export function render(body, data){
  return compile(body)(data)
}
