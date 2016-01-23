import * as u from './util';

let defaults = {}

let openTagRE = /<([^ \/]+?)( [^>]+)*?>/g

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

const parse = (str, opts) => {
    return lex(str)
}

export { parse as default }