import parse from './parser'
import { esc } from './util'

let CACHE = {}

export default function compile (body) {
    let parsed = CACHE[body] || ( CACHE[body] = parse(body) )
    parsed = esc( parsed.join('') )
        
    return new Function( 'data', `return '${parsed}'` )
}
