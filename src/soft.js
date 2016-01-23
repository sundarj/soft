import parse from './parser'
export { parse }

import compile from './compiler'
export { compile }

export const render = (body, data) => compile(body)(data)
