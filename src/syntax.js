"use strict";

function prefixed(obj, prefix) {
    return Array.prototype.concat.call(obj).map(item => (prefix||':') + item)
};

let Syntax = (prefix) => {
    return {
        entity: ['self', 'this', 'here'],
        attributes: prefixed(['is', 'of', 'as']),
        elements: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
        void: prefixed('void'),
        voidElements: ['import', 'include'],
        helper: prefixed('as')
    };
}

export default Syntax
