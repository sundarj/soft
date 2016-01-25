import { each, map, trim } from './util'
import Syntax from './syntax'

let SYNTAX = Syntax()
const DEFAULTS = {}


const openTagRE = /<([^ \/]+?)( [^>]+)*?>/g

function lex(str) {
    let ret = []
    let pos = 0
    
    for (let match; match = openTagRE.exec(str);) {
        ret.push( str.slice(pos, match.index) )
        ret.push(match)
        
        pos = (match.index + match[0].length)
    }
    
    return ret
}

const attrRE = /([^= ]+)=("[^"]*"|'[^']*'|[^"'\s>]*)/g
const softAttrRE = () => new RegExp(
    attrRE.source.replace( '[^= ]', SYNTAX.attributes.join('|') ),
    'g'
)

function findSoftAttrs(atts) {
    if (!atts) return null
    
    let attrs = atts.match( softAttrRE() )
    /*if (attrs) {
        attrs = attrs.map( attr => attr.split("=") )
    }*/
    
    return attrs
}

const _parse = (opts) => {
    return (token, index, tokens) => {
        if ( Array.isArray(token) ) {
            const softAttrs = findSoftAttrs( token[2] )
            
            if (softAttrs) {
                each(softAttrs, (softAttr) => {
                    token[2] = trim( token[2].replace(softAttr, '') )
                })
            }
            
            let nextToken = tokens[index + 1]
            if (typeof nextToken === 'string') {
                token.push(nextToken)
                delete tokens[index + 1]
            }
        }
        
        return token
    }
}

const parse = (str, opts) => {
    let tokens = lex(str)
    opts = Object.assign(DEFAULTS, opts)
    
    if (opts.prefix)
        SYNTAX = Syntax(opts.prefix)
    
    return map( tokens, _parse(opts) )
}

export default parse