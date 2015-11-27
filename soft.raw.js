(function () {

    "use strict";
	
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



    var SOFT_PREFIX = ':';

    function prefixed(obj) {
        if (Array.isArray(obj))
            return map(obj, function (item) {
                return SOFT_PREFIX + item;
            });
        else
            return SOFT_PREFIX + obj;
    };

    soft.syntax = {
        self: ['self', 'this', 'here'],
        attributes: prefixed(['is', 'of', 'as']),
        elements: prefixed(['import', 'include', 'if', 'else', 'endif', 'fi']),
        void: prefixed('void'),
        voidElements: ['import', 'include'],
        helper: prefixed('as')
    };


    function SoftError(message) {
        return 'SoftError: ' + message;
    };

    function htmlify(str) {
        return str.replace(/&(lt|gt|amp);/g, function (match, entity) {
            return ({
                'lt': '<',
                'gt': '>',
                'amp': '&'
            })[entity];
        });
    };

    function htmlescape(str) {
        return str.replace(/[&<>]/g, function (char) {
            return ({
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;'
            })[char];
        });

    };

    function noop(x) { return x };

    Array.from = Array.from || function (arraylike) {
        return [].slice.call(arraylike);
    };

    function isString(obj) {
        return typeof obj === 'string';
    };

    var isArray = Array.isArray;

    function isObject(obj) {
        return obj.constructor === Object;
    };

    function matchAll(string) {
        return new RegExp(string, "g");
    };

    function contains(array, value) {
        for (var i = 0, l = -1 + array.length, m = Math.floor((l + 1) / 2); i <= m; i++) {
            if (array[i] === value) return true;
            else if (array[(l - i)] === value) return true;
        }
        return false;
    }

    function has(obj, key) {
        return obj[key] != void(0);
    }

    function filterElements(tokenlist) {
        return tokenlist.filter(function (token) {
            return token.t === type('ELEMENT');
        });
    }

    function onlyTruthy(x) { return !!x }

    function flatten(arr) {
        return arr.reduce(function (a, b) {
            return a.concat(isArray(b) ? flatten(b) : b);
        }, []);
    };

    function each(arr, fn) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            if (fn(arr[index], index, arr) === false) {
                break;
            }
        }
    };

    function map(arr, fn) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = fn(arr[index], index, arr);
        }

        return result;
    };

    function any(arr, fn) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            if ( fn(arr[index]) ) {
                return true;
            }
        }

        return false;
    };

    function inspect(obj) {
        console.log(JSON.stringify(obj, null, 4));
    };
               
    
    /**
     * Parser base class
     * ractivejs/ractive/blob/master/src/parse/
     */

    var create = Object.create;
    var hasOwn = Object.prototype.hasOwnProperty;

    var Parser, ParseError, leadingWhitespace = /^\s+/;

    ParseError = function (message) {
        this.name = 'ParseError';
        this.message = message;
        try {
            throw new Error(message);
        } catch (e) {
            this.stack = e.stack;
        }
    };

    ParseError.prototype = Error.prototype;

    Parser = function (str, options) {
        var items, item, lineStart = 0;

        this.str = str;
        this.options = options || {};
        this.pos = 0;

        this.lines = this.str.split('\n');
        this.lineEnds = map(this.lines, line => {
            var lineEnd = lineStart + line.length + 1; // +1 for the newline
    
            lineStart = lineEnd;
            return lineEnd;
        }, 0);
    
        // Custom init logic
        if (this.init) this.init(str, options);

        items = [];

        while ((this.pos < this.str.length) && (item = this.read())) {
            items.push(item);
        }

        this.leftover = this.remaining();
        this.result = this.postProcess ? this.postProcess(items, options) : items;
    };

    Parser.prototype = {
        read: function (converters) {
            var pos, i, len, item;

            if (!converters) converters = this.converters;

            pos = this.pos;

            len = converters.length;
            for (i = 0; i < len; i += 1) {
                this.pos = pos; // reset for each attempt
    
                if (item = converters[i](this)) {
                    return item;
                }
            }

            return null;
        },

        getLinePos: function (char) {
            var lineNum = 0, lineStart = 0, columnNum;

            while (char >= this.lineEnds[lineNum]) {
                lineStart = this.lineEnds[lineNum];
                lineNum += 1;
            }

            columnNum = char - lineStart;
            return [lineNum + 1, columnNum + 1, char]; // line/col should be one-based, not zero-based!
        },

        error: function (message) {
            var pos = this.getLinePos(this.pos);
            var lineNum = pos[0];
            var columnNum = pos[1];

            var line = this.lines[pos[0] - 1];
            var numTabs = 0;
            var annotation = line.replace(/\t/g, (match, char) => {
                if (char < pos[1]) {
                    numTabs += 1;
                }

                return '  ';
            }) + '\n' + new Array(pos[1] + numTabs).join(' ') + '^----';

            var error = new ParseError(`${message} at line ${lineNum} character ${columnNum}:\n${annotation}`);

            error.line = pos[0];
            error.character = pos[1];
            error.shortMessage = message;

            throw error;
        },

        matchString: function (string) {
            if (this.str.substr(this.pos, string.length) === string) {
                this.pos += string.length;
                return string;
            }
        },

        matchPattern: function (pattern) {
            var match;

            if (match = pattern.exec(this.remaining())) {
                this.pos += match[0].length;
                return match[1] || match[0];
            }
        },

        allowWhitespace: function () {
            this.matchPattern(leadingWhitespace);
        },

        remaining: function () {
            return this.str.substring(this.pos);
        },

        nextChar: function () {
            return this.str.charAt(this.pos);
        }
    };

    Parser.extend = function (proto) {
        var Parent = this, Child, key;

        Child = function (str, options) {
            Parser.call(this, str, options);
        };

        Child.prototype = create(Parent.prototype);

        for (key in proto) {
            if (hasOwn.call(proto, key)) {
                Child.prototype[key] = proto[key];
            }
        }

        Child.extend = Parser.extend;
        return Child;
    };


    var types = ['',
        'TEXT', 'ELEMENT', 'COMMENT',
        'ATTRIBUTE', 'CLOSING_TAG', 'DOCTYPE',
    ];

    function type(token) { return types.indexOf(token) }


    var OPEN_COMMENT = '<!--',
        CLOSE_COMMENT = '-->';

    var booleanAttributes, voidElementNames, htmlEntities, controlCharacters, entityPattern;
    
    // https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
    booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible|escaped|:void)$/i;
    voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;

    htmlEntities = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402, circ: 710, tilde: 732, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243, lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364, image: 8465, weierp: 8472, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, 'int': 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830 };
    controlCharacters = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376];
    entityPattern = new RegExp('&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys(htmlEntities).join('|') + '));?', 'g');

    function decodeCharacterReferences(html) {
        return html.replace(entityPattern, function (match, entity) {
            var code;
    
            // Handle named entities
            if (entity[0] !== '#') {
                code = htmlEntities[entity];
            } else if (entity[1] === 'x') {
                code = parseInt(entity.substring(2), 16);
            } else {
                code = parseInt(entity.substring(1), 10);
            }

            if (!code) {
                return match;
            }

            return String.fromCharCode(validateCode(code));
        });
    }
    
    // some code points are verboten. If we were inserting HTML, the browser would replace the illegal
    // code points with alternatives in some cases - since we're bypassing that mechanism, we need
    // to replace them ourselves
    //
    // Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
    function validateCode(code) {
        if (!code) {
            return 65533;
        }
    
        // line feed becomes generic whitespace
        if (code === 10) {
            return 32;
        }
    
        // ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
        if (code < 128) {
            return code;
        }
    
        // code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
        // to correct the mistake or we'll end up with missing € signs and so on
        if (code <= 159) {
            return controlCharacters[code - 128];
        }
    
        // basic multilingual plane
        if (code < 55296) {
            return code;
        }
    
        // UTF-16 surrogate halves
        if (code <= 57343) {
            return 65533;
        }
    
        // rest of the basic multilingual plane
        if (code <= 65535) {
            return code;
        }

        return 65533;
    }

    var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;

    function readClosingTag(parser) {
        var start, tag;

        start = parser.pos;
    
        // are we looking at a closing tag?
        if (!parser.matchString('</')) {
            return null;
        }

        if (tag = parser.matchPattern(closingTagPattern)) {
            if (parser.inside && tag !== parser.inside) {
                parser.pos = start;
                return null;
            }

            return {
                t: type('CLOSING_TAG'),
                e: tag
            };
        }
    
        // We have an illegal closing tag, report it
        parser.pos -= 2;
        parser.error('Illegal closing tag');
    }

    var attributeNamePattern = /^[^\s"'>\/=]+/,
        unquotedAttributeValueTextPattern = /^[^\s"'=<>`]+/;

    function getLowestIndex(haystack, needles) {
        var i, index, lowest;

        i = needles.length;
        while (i--) {
            index = haystack.indexOf(needles[i]);
    
            // short circuit
            if (!index) {
                return 0;
            }

            if (index === -1) {
                continue;
            }

            if (!lowest || (index < lowest)) {
                lowest = index;
            }
        }

        return lowest || -1;
    }

    function readAttribute(parser) {
        var attr, name, value;

        parser.allowWhitespace();

        name = parser.matchPattern(attributeNamePattern);
        if (!name) {
            return null;
        }

        attr = { name };

        value = readAttributeValue(parser);
        if (value != null) { // not null/undefined
            attr.value = value;
        }

        return attr;
    }

    function readAttributeValue(parser) {
        var start, valueStart, startDepth, value;

        start = parser.pos;
    
        // next character must be `=`, `/`, `>` or whitespace
        if (!/[=\/>\s]/.test(parser.nextChar())) {
            parser.error('Expected `=`, `/`, `>` or whitespace');
        }

        parser.allowWhitespace();

        if (!parser.matchString('=')) {
            parser.pos = start;
            return null;
        }

        parser.allowWhitespace();

        valueStart = parser.pos;
        startDepth = parser.sectionDepth;

        value = readQuotedAttributeValue(parser, "'") ||
        readQuotedAttributeValue(parser, '"') ||
        readUnquotedAttributeValue(parser);

        if (value === null) {
            parser.error('Expected valid attribute value');
        }

        if (parser.sectionDepth !== startDepth) {
            parser.pos = valueStart;
            parser.error('An attribute value must contain as many opening section tags as closing section tags');
        }

        if (!value.length) {
            return '';
        }

        if (value.length === 1 && typeof value[0] === 'string') {
            return decodeCharacterReferences(value[0]);
        }

        return value;
    }

    function readUnquotedAttributeValueToken(parser) {
        var start, text, haystack, needles, index;

        start = parser.pos;

        text = parser.matchPattern(unquotedAttributeValueTextPattern);

        if (!text) {
            return null;
        }

        haystack = text;
        needles = []; // TODO refactor... we do this in readText.js as well
    
        if ((index = getLowestIndex(haystack, needles)) !== -1) {
            text = text.substr(0, index);
            parser.pos = start + text.length;
        }

        return text;
    }

    function readUnquotedAttributeValue(parser) {
        var tokens, token;

        parser.inAttribute = true;

        tokens = [];

        token = readUnquotedAttributeValueToken(parser);
        while (token !== null) {
            tokens.push(token);
            token = readUnquotedAttributeValueToken(parser);
        }

        if (!tokens.length) {
            return null;
        }

        parser.inAttribute = false;
        return tokens;
    }

    function readQuotedAttributeValue(parser, quoteMark) {
        var start, tokens, token;

        start = parser.pos;

        if (!parser.matchString(quoteMark)) {
            return null;
        }

        parser.inAttribute = quoteMark;

        tokens = [];

        token = readQuotedStringToken(parser, quoteMark);
        while (token !== null) {
            tokens.push(token);
            token = readQuotedStringToken(parser, quoteMark);
        }

        if (!parser.matchString(quoteMark)) {
            parser.pos = start;
            return null;
        }

        parser.inAttribute = false;

        return tokens;
    }

    function readQuotedStringToken(parser, quoteMark) {
        var start, index, haystack, needles;

        start = parser.pos;
        haystack = parser.remaining();

        needles = []; // TODO refactor... we do this in readText.js as well
        needles.push(quoteMark);

        index = getLowestIndex(haystack, needles);

        if (index === -1) {
            parser.error('Quoted attribute value must have a closing quote');
        }

        if (!index) {
            return null;
        }

        parser.pos += index;
        return haystack.substr(0, index);
    }



    function readHTMLComment(parser) {
        var start, content, remaining, endIndex, comment;

        start = parser.pos;

        if (!parser.matchString(OPEN_COMMENT)) {
            return null;
        }

        remaining = parser.remaining();
        endIndex = remaining.indexOf(CLOSE_COMMENT);

        if (endIndex === -1) {
            parser.error('Illegal HTML - expected closing comment sequence (\'-->\')');
        }

        content = remaining.substr(0, endIndex);
        parser.pos += endIndex + 3;

        comment = {
            t: type('COMMENT'),
            c: content
        };

        return comment;
    }

    var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/,
        validTagNameFollower = /^[\s\n\/>]/,
        exclude = { exclude: true },
        disallowedContents;
    
    // based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
    disallowedContents = {
        li: ['li'],
        dt: ['dt', 'dd'],
        dd: ['dt', 'dd'],
        p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split(' '),
        rt: ['rt', 'rp'],
        rp: ['rt', 'rp'],
        optgroup: ['optgroup'],
        option: ['option', 'optgroup'],
        thead: ['tbody', 'tfoot'],
        tbody: ['tbody', 'tfoot'],
        tfoot: ['tbody'],
        tr: ['tr', 'tbody'],
        td: ['td', 'th', 'tr'],
        th: ['td', 'th', 'tr']
    };

    function readElement(parser) {
        var start,
            element,
            attribute,
            selfClosing,
            children,
            partials,
            hasPartials,
            child,
            closed,
            pos,
            remaining,
            closingTag;

        start = parser.pos;

        if (parser.inside || parser.inAttribute) {
            return null;
        }

        if (!parser.matchString('<')) {
            return null;
        }
    
        // if this is a closing tag, abort straight away
        if (parser.nextChar() === '/') {
            return null;
        }

        element = {};
        if (parser.includeLinePositions) {
            element.p = parser.getLinePos(start);
        }

        if (parser.matchString('!')) {
            element.t = type('DOCTYPE');
            if (!parser.matchPattern(/^doctype/i)) {
                parser.error('Expected DOCTYPE declaration');
            }

            element.a = parser.matchPattern(/^(.+?)>/);
            return element;
        }

        element.t = type('ELEMENT');
    
        // element name
        element.e = parser.matchPattern(tagNamePattern);
        if (!element.e) {
            return null;
        }
    
        // next character must be whitespace, closing solidus or '>'
        if (!validTagNameFollower.test(parser.nextChar())) {
            parser.error('Illegal tag name');
        }

        parser.allowWhitespace();

        while (attribute = readAttribute(parser)) {
            if (attribute.name) {
                if (!element.a) element.a = {};

                if ( contains(soft.syntax.attributes, attribute.name) ) {
                    
                } else {
                    element.a[attribute.name] = attribute.value || (attribute.value === ''? '' : 0);
                }
            }

            parser.allowWhitespace();
        }
    
        // allow whitespace before closing solidus
        parser.allowWhitespace();
    
        // self-closing solidus?
        if (parser.matchString('/')) {
            selfClosing = true;
        }
    
        // closing angle bracket
        if (!parser.matchString('>')) {
            return null;
        }

        var lowerCaseName = element.e.toLowerCase();

        if (!selfClosing && !voidElementNames.test(element.e)) {
            parser.elementStack.push(lowerCaseName);
    
            // Special case - if we open a script element, further tags should
            // be ignored unless they're a closing script element
            if (lowerCaseName === 'script' || lowerCaseName === 'style') {
                parser.inside = lowerCaseName;
            }

            children = [];

            do {
                pos = parser.pos;
                remaining = parser.remaining();
    
                // if for example we're in an <li> element, and we see another
                // <li> tag, close the first so they become siblings
                if (!canContain(lowerCaseName, remaining)) {
                    closed = true;
                }
    
                // closing tag
                else if (closingTag = readClosingTag(parser)) {
                    closed = true;

                    var closingTagName = closingTag.e.toLowerCase();
    
                    // if this *isn't* the closing tag for the current element...
                    if (closingTagName !== lowerCaseName) {
                        // rewind parser
                        parser.pos = pos;
    
                        // if it doesn't close a parent tag, error
                        if (!~parser.elementStack.indexOf(closingTagName)) {
                            var errorMessage = 'Unexpected closing tag';
    
                            // add additional help for void elements, since component names
                            // might clash with them
                            if (voidElementNames.test(closingTagName)) {
                                errorMessage += ` (<${closingTagName}> is a void element - it cannot contain children)`;
                            }

                            parser.error(errorMessage);
                        }
                    }
                }

                else {
                    if (child = parser.read(READERS)) {
                        children.push(child);
                    } else {
                        closed = true;
                    }
                }
            } while (!closed);

            if (children.length) {
                element.f = children;
            }

            if (hasPartials) {
                element.p = partials;
            }

            parser.elementStack.pop();
        }

        parser.inside = null;

        if (parser.sanitizeElements && parser.sanitizeElements.indexOf(lowerCaseName) !== -1) {
            return exclude;
        }

        return element;
    }

    function canContain(name, remaining) {
        var match, disallowed;

        match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(remaining);
        disallowed = disallowedContents[name];

        if (!match || !disallowed) {
            return true;
        }

        return !~disallowed.indexOf(match[1].toLowerCase());
    }

    function readText(parser) {
        var index, remaining, disallowed, barrier;

        remaining = parser.remaining();

        barrier = parser.inside ? '</' + parser.inside : '<';

        if (parser.inside) {
            index = remaining.indexOf(barrier);
        } else {
            disallowed = [];
    
            // http://developers.whatwg.org/syntax.html#syntax-attributes
            if (parser.inAttribute === true) {
                // we're inside an unquoted attribute value
                disallowed.push('"', "'", '=', '<', '>', '`');
            } else if (parser.inAttribute) {
                // quoted attribute value
                disallowed.push(parser.inAttribute);
            } else {
                disallowed.push(barrier);
            }

            index = getLowestIndex(remaining, disallowed);
        }

        if (!index) {
            return null;
        }

        if (index === -1) {
            index = remaining.length;
        }

        parser.pos += index;

        return parser.inside ? remaining.substr(0, index) : decodeCharacterReferences(remaining.substr(0, index));
    }

    var READERS = [readHTMLComment, readElement, readText];

    function readDocument(parser) {
        var fragment = [];

        while (parser.pos < parser.str.length) {
            var item;

            if (item = parser.read(READERS));
            fragment.push(item);
        }

        return fragment
    }

    var SoftParser = Parser.extend({

        init: function () {
            this.elementStack = [];
        },

        converters: [readDocument]

    });
    

   
    //var softEntityPattern = new RegExp(`&(${soft.syntax.self.join('|')})(\[[^\]]+?\]|\.[^;]+?)?;`);
    var softAttributePattern = new RegExp(soft.syntax.attributes.join('|'));
    /*    
        function t(key) {
            return function(template) {
                return template[key];
            }
        }
        
        function compileAttribute(hasContent, elt, attr) {
            if (hasContent)
                ;
            else
                elt.f = [ t( elt.a[attr] ) ];
        }
        
        function compileAttributes(elt) {
            var hasContent = !!elt.f;
            
            for (var attr in elt.a) {
                if ( softAttributePattern.test(attr) )
                    compileAttribute(hasContent, elt, attr);
            }
        }
        
        function compileElement(elt) {
            //inspect(elt);
            
            if (elt.a)
                compileAttributes(elt);
                
            console.log(elt.f);
            
            return elt;
        }
        
        function compile(parsed) {
            return map(parsed, function(tok) {
               if ( !(tok.t === type('ELEMENT')) )
                   return tok;
                   
               if (tok.f)
                   tok.f = compile(tok.f);
               
               return compileElement(tok); 
            });
        } */

    function interpolate(f, template) {
        return map(f, function (t) {
            if (t.f)
                t.f = interpolate(t.f, template);

            if (typeof t === 'function')
                return t(template);

            return t;
        });
    }

    function integrate(parsed, template) {
        return map(parsed, function (tok) {
            if (!tok.f)
                return tok;

            tok.f = interpolate(tok.f, template);

            return tok;
        });
    }

    var to = soft.to = {};

    to.element = function (token) {
        var name = token.e;
        var attrs = '';

        var isVoid;

        if (name && token.a)
            isVoid = soft.syntax.void in token.a || contains(soft.syntax.voidElements, name);

        for (var attr in token.a) {
            if ( !contains(soft.syntax.attributes, attr) && !(attr === soft.syntax.void) )
                attrs += ` ${attr}="${token.a[attr]}"`;
        }

        var content = '';

        if (token.f)
            content = to.document(token.f);

        content += `</${name}>`;

        return `<${name + attrs}>${isVoid ? '' : content}`;
    };

    to.document = function (parsed) {
        return map(parsed, function (token) {
            if (typeof token === 'string') {
                return htmlescape(token);
            } else if (typeof token === 'object') {
                switch (token.t) {
                    case type('ELEMENT'):
                        return to.element(token);
                    case type('COMMENT'):
                        return `<!--${token.c}-->`;
                    case type('DOCTYPE'):
                        return `<!DOCTYPE${token.a}>`;
                }
            }

        }).join('');
    };

    function render(compiled, template) {
        compiled = integrate(compiled, template);
        return to.document(compiled);
    }

    soft.parse = function (str) {
        return new SoftParser(str).result[0];
    };

    var CACHE = {};

    soft.compile = function (str) {
        var parsed = CACHE[str] || (CACHE[str] = soft.parse(str));
        //var compiled = compile(parsed);

        return function (template) {
            return render(parsed, template);
        }
    }

    soft.render = function (str, template) {
        return soft.compile(str)(template);
    }


    if (typeof define == 'function' && define.amd) {
        define('soft', [], function () {
            return soft;
        });
    }

})();