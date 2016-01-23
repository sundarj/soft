"use strict";

export const htmlify = (str) => {
    return str.replace(/&(lt|gt|amp);/g, function (match, entity) {
        return ({
            'lt': '<',
            'gt': '>',
            'amp': '&'
        })[entity]
    })
}

export const htmlescape = (str) => {
    return str.replace(/[&<>]/g, function (char) {
        return ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        })[char]
    })
}

export const noop = (x) => x

export const isString = (obj) => typeof obj === 'string'

export const isArray = Array.isArray

export const isObject = (obj) => typeof obj === 'object'

export const contains = (array, value) => {
    for (let i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
        if ( array[i] === value )
            return true
        else if ( array[(l - i)] === value )
            return true
    }
    return false
}

export const has = (obj, key) => obj[key] != void 0

export const each = (arr, fn) => {
    let index = -1
    let length = arr.length

    while (++index < length) {
        fn(arr[index], index, arr)
    }
};

export const map = (arr, fn) => {
    let index = -1
    let length = arr.length
    let result = Array(length)

    while (++index < length) {
        result[index] = fn(arr[index], index, arr)
    }

    return result
};

export const inspect = (obj) => console.log( JSON.stringify(obj, null, 4) )

export const trim = (s) => s.trim? s.trim() : s.replace(/^\s*|\s*$/g, '')

const squotRE = /'/g;
const quotRE = /"/g;
const lfRE =  /\n/g;
const crRE = /\r/g;
const slashRE = /\\/g;
const lineSepRE = /\u2028/;
const paraSepRE = /\u2029/;

export const esc = (s) => {
    return s
            .replace(slashRE, '\\\\')
            .replace(squotRE, '\\\'')
            .replace(quotRE, '\\"')
            .replace(lfRE, '\\n')
            .replace(crRE, '\\r')
            .replace(lineSepRE, '\\u2028')
            .replace(paraSepRE, '\\u2029');
  }

