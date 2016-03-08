import parse, { lex } from './parser'
export { parse, lex }

import compile from './compiler'
export { compile }

export const config = {
  prefix: ':',
}

export function configure(options) {
  
  Object.assign(config, options)
  
  /* eslint-disable no-undef */
  return soft
  /* eslint-enable no-undef */
}

export function render(body, data) {
  
  return compile(body)(data)
}
