(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.soft = {})));
}(this, function (exports) { 'use strict';

    function parse() {}

    function compile() {}
    function render() {
        return compile()
    }

    exports.parse = parse;
    exports.compile = compile;
    exports.render = render;

}));