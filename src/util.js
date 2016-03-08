export function htmlify(str) {
  
  return str.replace(/&(lt|gt|amp);/g, (match, entity) => (
    ({
      lt: '<',
      gt: '>',
      amp: '&',
    })[entity]
  ))
}

export function htmlescape(str) {
  
  return str.replace(/[&<>]/g, char => (
    ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
    })[char]
  ))
}

export function noop(x) { return x }

export function contains(array, value) {
  
  for (let i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
    if ( array[i] === value ) return true
    else if ( array[(l - i)] === value ) return true
  }
  
  return false
}

export function has(obj, key) {
  
  return obj[key] != null
}

export function each(arr, fn) {
  
  let index = -1
  const length = arr.length

  while (++index < length) {
    fn(arr[index], index, arr)
  }
}

export function map(arr, fn) {
  
  let index = -1
  const length = arr.length
  const result = Array(length)

  while (++index < length) {
    result[index] = fn(arr[index], index, arr)
  }

  return result
}

export function filter(arr, predic) {
  
  let index = -1
  const length = arr.length
  const result = []
  
  while (++index < length) {
    if ( predic(arr[index]) ) result.push(arr[index])
  }
  
  return result
}

export function trim(s) {
  
  return s.trim ? s.trim() : s.replace(/^\s*|\s*$/g, '')
}

export function esc(s) {
  
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u2028/, '\\u2028')
    .replace(/\u2029/, '\\u2029')
}
