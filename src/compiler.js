import parse from './parser'

let CACHE = {}

const compile = (body) => {
    let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
    
    return new Function( 'data', `return ${parsed.join('')}` )
}

export { compile as default }