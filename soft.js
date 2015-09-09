"use strict";

(function () {
	
    // UMD from underscorejs.org

    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    var soft = function (obj) {
        if (obj instanceof soft) return obj;
        if (!(this instanceof soft)) return new soft;
    }

    if (typeof exports != 'undefined') {
        if (typeof module != 'undefined' && module.exports) {
            exports = module.exports = soft;
        }
        exports.soft = soft;
    } else {
        root.soft = soft;
    }


    var parser = (function () {
        "use strict";

        /*
         * Generated by PEG.js 0.9.0.
         *
         * http://pegjs.org/
         */

        function peg$subclass(child, parent) {
            function ctor() { this.constructor = child; }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
        }

        function peg$SyntaxError(message, expected, found, location) {
            this.message = message;
            this.expected = expected;
            this.found = found;
            this.location = location;
            this.name = "SyntaxError";

            if (typeof Error.captureStackTrace === "function") {
                Error.captureStackTrace(this, peg$SyntaxError);
            }
        }

        peg$subclass(peg$SyntaxError, Error);

        function peg$parse(input) {
            var options = arguments.length > 1 ? arguments[1] : {},
                parser = this,

                peg$FAILED = {},

                peg$startRuleFunctions = { document: peg$parsedocument },
                peg$startRuleFunction = peg$parsedocument,

                peg$c0 = "<",
                peg$c1 = { type: "literal", value: "<", description: "\"<\"" },
                peg$c2 = "/",
                peg$c3 = { type: "literal", value: "/", description: "\"/\"" },
                peg$c4 = ">",
                peg$c5 = { type: "literal", value: ">", description: "\">\"" },
                peg$c6 = function (cs, t, sc) {
                    return {
                        type: 'tag',
                        content: t,
                        closing: !!cs,
                        original: '<' + (cs || '') + elementBody(t) + (sc || '') + '>'
                    };
                },
                peg$c7 = function (ht, attrs) {
                    return {
                        tagname: ht,
                        attributes: attrs
                    }
                },
                peg$c8 = /^[a-zA-Z0-9:\-]/,
                peg$c9 = { type: "class", value: "[a-zA-Z0-9:-]", description: "[a-zA-Z0-9:-]" },
                peg$c10 = function (tn) {
                    return tn.join('')
                },
                peg$c11 = function (attrName, attrVal) {
                    if (attrVal && attrVal.length < 1) attrVal = 'empty'
                    return {
                        name: attrName,
                        value: attrVal || true
                    }
                },
                peg$c12 = " ",
                peg$c13 = { type: "literal", value: " ", description: "\" \"" },
                peg$c14 = function (ws) { return ws.join('') },
                peg$c15 = /^[^"'>\/= ]/,
                peg$c16 = { type: "class", value: "[^\"'>/= ]", description: "[^\"'>/= ]" },
                peg$c17 = function (name) { return name.join('') },
                peg$c18 = "'",
                peg$c19 = { type: "literal", value: "'", description: "\"'\"" },
                peg$c20 = "\"",
                peg$c21 = { type: "literal", value: "\"", description: "\"\\\"\"" },
                peg$c22 = "=",
                peg$c23 = { type: "literal", value: "=", description: "\"=\"" },
                peg$c24 = function (quot) { return quot },
                peg$c25 = /^[^']/,
                peg$c26 = { type: "class", value: "[^']", description: "[^']" },
                peg$c27 = function (q, val) { return q + val.join('') + q },
                peg$c28 = /^[^"]/,
                peg$c29 = { type: "class", value: "[^\"]", description: "[^\"]" },
                peg$c30 = /^[^'" >=]/,
                peg$c31 = { type: "class", value: "[^'\" >=]", description: "[^'\" >=]" },
                peg$c32 = function (val) { return val.join('') },
                peg$c33 = /^[^<]/,
                peg$c34 = { type: "class", value: "[^<]", description: "[^<]" },
                peg$c35 = function (txt) {
                    return {
                        type: 'text',
                        content: txt.join('')
                    }
                },

                peg$currPos = 0,
                peg$savedPos = 0,
                peg$posDetailsCache = [{ line: 1, column: 1, seenCR: false }],
                peg$maxFailPos = 0,
                peg$maxFailExpected = [],
                peg$silentFails = 0,

                peg$result;

            if ("startRule" in options) {
                if (!(options.startRule in peg$startRuleFunctions)) {
                    throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
                }

                peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
            }

            function text() {
                return input.substring(peg$savedPos, peg$currPos);
            }

            function location() {
                return peg$computeLocation(peg$savedPos, peg$currPos);
            }

            function expected(description) {
                throw peg$buildException(
                    null,
                    [{ type: "other", description: description }],
                    input.substring(peg$savedPos, peg$currPos),
                    peg$computeLocation(peg$savedPos, peg$currPos)
                    );
            }

            function error(message) {
                throw peg$buildException(
                    message,
                    null,
                    input.substring(peg$savedPos, peg$currPos),
                    peg$computeLocation(peg$savedPos, peg$currPos)
                    );
            }

            function peg$computePosDetails(pos) {
                var details = peg$posDetailsCache[pos],
                    p, ch;

                if (details) {
                    return details;
                } else {
                    p = pos - 1;
                    while (!peg$posDetailsCache[p]) {
                        p--;
                    }

                    details = peg$posDetailsCache[p];
                    details = {
                        line: details.line,
                        column: details.column,
                        seenCR: details.seenCR
                    };

                    while (p < pos) {
                        ch = input.charAt(p);
                        if (ch === "\n") {
                            if (!details.seenCR) { details.line++; }
                            details.column = 1;
                            details.seenCR = false;
                        } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                            details.line++;
                            details.column = 1;
                            details.seenCR = true;
                        } else {
                            details.column++;
                            details.seenCR = false;
                        }

                        p++;
                    }

                    peg$posDetailsCache[pos] = details;
                    return details;
                }
            }

            function peg$computeLocation(startPos, endPos) {
                var startPosDetails = peg$computePosDetails(startPos),
                    endPosDetails = peg$computePosDetails(endPos);

                return {
                    start: {
                        offset: startPos,
                        line: startPosDetails.line,
                        column: startPosDetails.column
                    },
                    end: {
                        offset: endPos,
                        line: endPosDetails.line,
                        column: endPosDetails.column
                    }
                };
            }

            function peg$fail(expected) {
                if (peg$currPos < peg$maxFailPos) { return; }

                if (peg$currPos > peg$maxFailPos) {
                    peg$maxFailPos = peg$currPos;
                    peg$maxFailExpected = [];
                }

                peg$maxFailExpected.push(expected);
            }

            function peg$buildException(message, expected, found, location) {
                function cleanupExpected(expected) {
                    var i = 1;

                    expected.sort(function (a, b) {
                        if (a.description < b.description) {
                            return -1;
                        } else if (a.description > b.description) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    while (i < expected.length) {
                        if (expected[i - 1] === expected[i]) {
                            expected.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                }

                function buildMessage(expected, found) {
                    function stringEscape(s) {
                        function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

                        return s
                            .replace(/\\/g, '\\\\')
                            .replace(/"/g, '\\"')
                            .replace(/\x08/g, '\\b')
                            .replace(/\t/g, '\\t')
                            .replace(/\n/g, '\\n')
                            .replace(/\f/g, '\\f')
                            .replace(/\r/g, '\\r')
                            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
                            .replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) { return '\\x' + hex(ch); })
                            .replace(/[\u0100-\u0FFF]/g, function (ch) { return '\\u0' + hex(ch); })
                            .replace(/[\u1000-\uFFFF]/g, function (ch) { return '\\u' + hex(ch); });
                    }

                    var expectedDescs = new Array(expected.length),
                        expectedDesc, foundDesc, i;

                    for (i = 0; i < expected.length; i++) {
                        expectedDescs[i] = expected[i].description;
                    }

                    expectedDesc = expected.length > 1
                        ? expectedDescs.slice(0, -1).join(", ")
                        + " or "
                        + expectedDescs[expected.length - 1]
                        : expectedDescs[0];

                    foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

                    return "Expected " + expectedDesc + " but " + foundDesc + " found.";
                }

                if (expected !== null) {
                    cleanupExpected(expected);
                }

                return new peg$SyntaxError(
                    message !== null ? message : buildMessage(expected, found),
                    expected,
                    found,
                    location
                    );
            }

            function peg$parsedocument() {
                var s0, s1;

                s0 = [];
                s1 = peg$parsehtml();
                if (s1 === peg$FAILED) {
                    s1 = peg$parsetext();
                }
                if (s1 !== peg$FAILED) {
                    while (s1 !== peg$FAILED) {
                        s0.push(s1);
                        s1 = peg$parsehtml();
                        if (s1 === peg$FAILED) {
                            s1 = peg$parsetext();
                        }
                    }
                } else {
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsehtml() {
                var s0, s1, s2, s3, s4, s5;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 60) {
                    s1 = peg$c0;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c1); }
                }
                if (s1 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 47) {
                        s2 = peg$c2;
                        peg$currPos++;
                    } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c3); }
                    }
                    if (s2 === peg$FAILED) {
                        s2 = null;
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsetag();
                        if (s3 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 47) {
                                s4 = peg$c2;
                                peg$currPos++;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c3); }
                            }
                            if (s4 === peg$FAILED) {
                                s4 = null;
                            }
                            if (s4 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 62) {
                                    s5 = peg$c4;
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c5); }
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c6(s2, s3, s4);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsetag() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parsetagname();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    s3 = peg$parseattribute();
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        s3 = peg$parseattribute();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c7(s1, s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsetagname() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (peg$c8.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c9); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c8.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c9); }
                        }
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c10(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseattribute() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parsewhitespace();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parseattributename();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseattributevalue();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c11(s2, s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsewhitespace() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (input.charCodeAt(peg$currPos) === 32) {
                    s2 = peg$c12;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (input.charCodeAt(peg$currPos) === 32) {
                            s2 = peg$c12;
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c13); }
                        }
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c14(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parseattributename() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (peg$c15.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c16); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c15.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c16); }
                        }
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c17(s1);
                }
                s0 = s1;

                return s0;
            }

            function peg$parsesquote() {
                var s0;

                if (input.charCodeAt(peg$currPos) === 39) {
                    s0 = peg$c18;
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                }

                return s0;
            }

            function peg$parsedquote() {
                var s0;

                if (input.charCodeAt(peg$currPos) === 34) {
                    s0 = peg$c20;
                    peg$currPos++;
                } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }

                return s0;
            }

            function peg$parseattributevalue() {
                var s0;

                s0 = peg$parsequotedattribute();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseunquotedattribute();
                }

                return s0;
            }

            function peg$parsequotedattribute() {
                var s0, s1, s2;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s1 = peg$c22;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c23); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parsesinglequoted();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parsedoublequoted();
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c24(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsesinglequoted() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parsesquote();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c25.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c26); }
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c25.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c26); }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsesquote();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c27(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsedoublequoted() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                s1 = peg$parsedquote();
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c28.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c29); }
                    }
                    while (s3 !== peg$FAILED) {
                        s2.push(s3);
                        if (peg$c28.test(input.charAt(peg$currPos))) {
                            s3 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c29); }
                        }
                    }
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parsedquote();
                        if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c27(s1, s2);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parseunquotedattribute() {
                var s0, s1, s2, s3;

                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 61) {
                    s1 = peg$c22;
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c23); }
                }
                if (s1 !== peg$FAILED) {
                    s2 = [];
                    if (peg$c30.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c31); }
                    }
                    if (s3 !== peg$FAILED) {
                        while (s3 !== peg$FAILED) {
                            s2.push(s3);
                            if (peg$c30.test(input.charAt(peg$currPos))) {
                                s3 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s3 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c31); }
                            }
                        }
                    } else {
                        s2 = peg$FAILED;
                    }
                    if (s2 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c32(s2);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }

                return s0;
            }

            function peg$parsetext() {
                var s0, s1, s2;

                s0 = peg$currPos;
                s1 = [];
                if (peg$c33.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c34); }
                }
                if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (peg$c33.test(input.charAt(peg$currPos))) {
                            s2 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c34); }
                        }
                    }
                } else {
                    s1 = peg$FAILED;
                }
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c35(s1);
                }
                s0 = s1;

                return s0;
            }


            function elementBody(peg$tag) {
                var ret = peg$tag.tagname;
                ret += peg$tag.attributes.map(function (attr) {
                    return ' ' + attr.name + '=' + attr.value
                }).join('');
                return ret;
            }


            peg$result = peg$startRuleFunction();

            if (peg$result !== peg$FAILED && peg$currPos === input.length) {
                return peg$result;
            } else {
                if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                    peg$fail({ type: "end", description: "end of input" });
                }

                throw peg$buildException(
                    null,
                    peg$maxFailExpected,
                    peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
                    peg$maxFailPos < input.length
                        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
                    );
            }
        }

        return {
            SyntaxError: peg$SyntaxError,
            parse: peg$parse
        };
    })();
    
    
    
    var lexicon = new Map;

    function prefixed(array) {
        var prefix = ':';
        return array.map(function (item) {
            return item.map ? prefixed(item) : prefix + item;
        });
    }
    
    function flatten(array) {
        return array.reduce(function (a, b) {
            return a.concat(b);
        }, []);
    }

    var softSelf = prefixed(['self', 'i', 'this', 'here']);
    var softAttributes = prefixed(['is', 'of', 'at', 'void']);
    var elements = prefixed([['import', 'include'], 'if', 'else', ['endif', 'fi']]);
    var softElements = flatten(elements);
    var softVoid = ':void';
    

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var unescapedElementRegex = new RegExp('&lt;(' + softElements.join('|') + ')[^&]+?&gt;', 'g');

    function SoftError(message) {
        return 'SoftError: ' + message;
    }

    soft.parse = function (string) {
        if (typeof string !== 'string')
            throw SoftError('Cannot parse ' + typeof string);

        var unescaped = string.replace(unescapedElementRegex, function (match) {
            return match.replace('&lt;', '<').replace('&gt;', '>'); // turn &lt;:import ...&gt; into the "element"
        });

        var parsed = parser.parse(unescaped);

        function onlyTruthy(x) { return !!x }

        parsed = parsed.filter(function (token) {
            return !token.closing && token.type !== 'text';
        }).map(function (element) {
            var isSoftElement = ~softElements.indexOf(element.content.tagname);
            var isSoftAttribute = false;
            element.content.attributes.forEach(function (attr) {
                if (~softAttributes.indexOf(attr.name))
                    isSoftAttribute = true;
            });

            if (isSoftElement || isSoftAttribute) {
                return {
                    type: isSoftAttribute ? 'attribute' : 'element',
                    actual: element
                };
            }
        }).filter(onlyTruthy);

        return parsed;
    };
    
    function unquote(attr) {
        return attr.value.replace(/['"]/g, '');
    }

    soft.attributeActions = {

        ':is': function (token, template, attr) {
            var unquoted = unquote(attr);
            var original = token.actual.original;
            
            if (~original.indexOf(softVoid)) {
                softSelf.forEach(function (self) {
                    original = original.replace(self, template[unquoted]);
                });
                return original;
            }
            
            return original + template[unquoted];
        },

        ':of': function (token, template, attr) {
            var unquoted = unquote(attr);
            var list = template[unquoted];
            var ret = token.actual.original;
            list.forEach(function (item, index) {
                if (index < 1)
                    ret += item
                else
                    ret += token.actual.original + item
            });
            return ret;
        }

    };

    soft.defineAttribute = function (attr, action) {
        soft.attributeActions[attr] = action;
    }

    function renderAttribute(token, template) {
        var attributes = token.actual.content.attributes;
        var ret = token.actual.original;
        attributes.forEach(function (attr) {
            var attribute = " " + attr.name + "=" + attr.value;

            var action = soft.attributeActions[attr.name];
            if (action) {
                ret = action(token, template, attr);
            }
            ret = ret.replace(new RegExp(attribute, "g"), '');
        });
        return ret;
    }
    
    function softImport(src) {
        var http = new XMLHttpRequest();
        http.open("get", src, false);
        http.send();
        return http.responseText;
    }

    soft.elementActions = {
        
        ':import': function (args) {
            var ret;
            args.forEach(function (arg) {
                if (arg.name === 'src') {
                    var src = unquote(arg);
                    ret = softImport(src);
                }
            });
            return ret;
        }
        
    };

    soft.elementActions[':include'] = soft.elementActions[':import'];

    soft.defineElement = function (attr, action) {
        soft.elementActions[attr] = action;
    }

    function renderElement(token) {
        var content = token.actual.content;
        var action = soft.elementActions[content.tagname];
        var ret;
        if (action) {
            ret = action(content.attributes);
        }
        return ret;
    }
    
    function unescape(html) {
        return html.replace(/&(l|g)t;/g, function (match, direction) {
            if (direction === 'l')
                return '<';
            else
                return '>';
        });
    }

    soft.render = function (it, template) {
        var parsed = soft.parse(it);
        parsed.forEach(function (token) {
            if (token.type === 'attribute')
                it = it.replace(token.actual.original, renderAttribute(token, template))
            else
                it = unescape(it).replace(token.actual.original, renderElement(token));
        });
        
        return it;
    }

    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();