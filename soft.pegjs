document = (html / text / comment)+

html = markup:(open document? close?) {
  return {
    type: 'element',
    content: markup
  }
}

open = '<' tn:tagname attrs:attribute* '/'? '>'
{
  return {
    type: 'open tag',
    tagname: tn,
    attributes: attrs
  };
}

close = '</' tn:tagname '>' {
  return {
    type: 'close tag',
    tagname: tn
  }
}

tag = tn:tagname attrs:attribute*
{
  return {
    tagname: tn,
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
    value: attrVal || ''
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


/* https://gist.github.com/netgusto/f9866c8abff3672406d4 */
comment = "<!--" c:(!"-->" c:. {return c })+ "-->" {
  return {
    type: 'comment',
    content: c.join('')
  }
}
