function prefixed(item, prefix) {
  
  if (typeof item === 'string') return prefix + item
  
  return item.map(i => prefix + i)
}

export default function syntax(prefix) {
  
  return {
    ENTITY: ['self', 'this', 'here'],
    ATTRIBUTE: prefixed(['is', 'of', 'as'], prefix),
    ELEMENT: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi'], prefix),
    HELPER: prefixed('as', prefix),
  }
}
