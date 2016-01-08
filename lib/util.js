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

export const matchAll = (string) => new RegExp(string, "g")

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

export const flatten = (arr) => {
    return arr.reduce(function (a, b) {
        return a.concat(isArray(b) ? flatten(b) : b)
    }, [])
};

export const each = (arr, fn) => {
    let index = -1
    let length = arr.length

    while (++index < length) {
        if (fn(arr[index], index, arr) === false) {
            break
        }
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