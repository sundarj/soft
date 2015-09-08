document = (html / text)+

html = '<' cs:'/'? t:tag '/'? '>'
{
  return {
    type: 'tag',
    content: t,
    closing: !!cs
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

singlequoted = squote val:[^']* squote { return val.join('') }
doublequoted = dquote val:[^"]* dquote { return val.join('') }

unquotedattribute = "=" val:[^'" >=]+ { return val.join('') }



text = txt:[^<]+
{
  return {
    type: 'text',
    content: txt.join('')
  }
}
