{
  function elementBody(peg$tag) {
    var ret = peg$tag.tagname;
    ret += peg$tag.attributes.map(function(attr) {
      return ' ' + attr.name + '=' + attr.value
    }).join('');
    return ret;
  }
}

document = (html / text)+

html = '<' cs:'/'? t:tag sc:'/'? '>'
{
  return {
    type: 'tag',
    content: t,
    closing: !!cs,
    original: '<' + (cs || '') + elementBody(t) + (sc || '') + '>'
  };
}

tag = ht:tagname attrs:attribute*
{
  return {
    tagname: ht,
    attributes: attrs
  } 
}

tagname = tn:[a-zA-Z0-9:-]+ 
{
  return tn.join('')
}

attribute = whitespace attrName:attributename attrVal:attributevalue?
{
  if (attrVal && attrVal.length < 1) attrVal = 'empty'
  return {
    name: attrName,
    value: attrVal || true
  }
}

whitespace = ws:" "+ { return ws.join('') }

attributename = name:[^"'>/= ]+ { return name.join('') }

squote = "'"
dquote = '"'

attributevalue = quotedattribute / unquotedattribute

quotedattribute = "=" quot:(singlequoted / doublequoted) { return quot }

singlequoted = q:squote val:[^']* squote { return q + val.join('') + q }
doublequoted = q:dquote val:[^"]* dquote { return q + val.join('') + q }

unquotedattribute = "=" val:[^'" >=]+ { return val.join('') }



text = txt:[^<]+
{
  return {
    type: 'text',
    content: txt.join('')
  }
}
