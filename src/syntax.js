"use strict";

function prefixed(obj, prefix) {
    return Array.prototype.concat.call(obj).map(item => (prefix||':') + item)
};

let Syntax = (prefix) => {
    return {
        ENTITY: ['self', 'this', 'here'],
        ATTRIBUTE: prefixed(['is', 'of', 'as']),
        ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
        /*void: prefixed('void'),
        voidElements: ['import', 'include'],*/
        HELPER: prefixed('as'),
    };
}

export default Syntax
