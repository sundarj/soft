"use strict";

export let SOFT_PREFIX = ':';

function prefixed(obj) {
    if ( Array.isArray(obj) )
        return obj.map(function (item) {
            return SOFT_PREFIX + item;
        })
    else
        return SOFT_PREFIX + obj
};

let syntax = {
    self: ['self', 'this', 'here'],
    attributes: prefixed(['is', 'of', 'as']),
    elements: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
    void: prefixed('void'),
    voidElements: ['import', 'include'],
    helper: prefixed('as')
};

export default syntax
