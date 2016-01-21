var currentToken, tokens;

function nextToken() {
    return tokens.next().value;
}

function express(precedence) {
    var token = currentToken;
    currentToken = nextToken();
    
    precedence = precedence || 0;

    var left = token.nud();
    while (precedence < currentToken.precedence) {
        token = currentToken;
        currentToken = nextToken();
        left = token.led(left);
    }
    
    return left;
}

function Open(string) {
    this.nud = function () {
        return string
    }
}

function Attr(left) {
    this.precedence = 10;
    this.led = function (left) {
        return left + express(this.precedence);
    }
}

function Mul(left) {
    this.precedence = 20;
    this.led = function (left) {
        return left * express(this.precedence);
    }
}

function End() {
    this.precedence = 0;
}

var tokenRegex = /\s*(?:(\d+)|(.))/g;

function *tokenize(program) {
    var toks = program.match(tokenRegex);
    for (var i of toks) {
        if (/\d+/.test(i))
            yield (new Literal(i));
        else if (i === '+')
            yield (new Add)
        else if (i === '*')
            yield (new Mul)
    }
    yield (new End);
}

function parse(program) {
    tokens = tokenize(program);
    currentToken = nextToken();
    return express();
}