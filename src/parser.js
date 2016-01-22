import { each } from './util';

let defaults = {
    indent: false
}

function lex(str) {
    let ret = []
    
    each(str, (char) => {
        ret.push(char)
    })
    
    return ret
}

export default function parse(str, opts) {
    return lex(str)
}