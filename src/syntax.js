"use strict";

function prefixed(item, prefix) {
  if (typeof item === 'string') return prefix + item;
  
  return item.map(item => prefix + item)
};

export default function Syntax(prefix) {
  return {
    ENTITY: ['self', 'this', 'here'],
    ATTRIBUTE: prefixed(['is', 'of', 'as'], prefix),
    ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi'], prefix),
    /*void: prefixed('void'),
    voidElements: ['import', 'include'],*/
    HELPER: prefixed('as', prefix),
  };
}
