import parse from './parser'
import { esc } from './util'

let CACHE = {}

const compile = (body) => {
    let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
    parsed = esc( parsed.join('') )
        
    return new Function( 'data', `return '${parsed}'` )
}

export { compile as default }