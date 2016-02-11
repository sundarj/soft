import parse, { lex } from './parser'
export { parse, lex }

import compile from './compiler'
export { compile }

export const render = (body, data) => compile(body)(data)
