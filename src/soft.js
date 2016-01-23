import parse from './parser'
export { parse }

let CACHE = {}

export const compile = (body) => {
    let parsed = CACHE[body] || (CACHE[body] = parse(body))
    
    return new Function( 'data', `return ${JSON.stringify(parsed)}` )
}

export const render = (body, data) => compile(body)(data)
