### soft [![Build Status](https://travis-ci.org/sundarj/soft.svg?branch=rewrite)](https://travis-ci.org/sundarj/soft)
light html-esque templating engine (under development)


#### about

soft is an extensible templating engine that aims to be as close to plain HTML as possible. Using a few elements and some attributes (and no curly-braces), it aims to be simple and expressive.

#### syntax

it uses three basic types of expression: elements, attributes, and entities which can be plugged in to an existing html document with minimal visual change, and which follow the same syntax as html (ish). soft auto-closes elements, so you can even leave out closing tags if you want.

#### elements

```html
<!-- file extensions default to .html -->

<import src="file/to/import" escaped?>
<include src="file/to/import" escaped?>
imports a file into the current document

<block foo>
</block>
encapsulates a block (used for template inheritance)

<extends layout>
<extends rel="layout.ext">
defines which template to inherit from

<if item>
<if item="value">
starts an if block

<else>
starts an else block

</if>
ends an if block
```

#### attributes

```html
<element :is="title">
insert the content from the template under the "title" key into the element

<element :of="array">
iterate over `somearray`, creating a new element for each item

<element :of|:is :as="currency">
<element :of|:is :as="currency|bold">
use the `currency` helper on the content from the template matching this element
multiple helpers can be provided, delimited by the `|` character
```

#### entities

```html
&self;
&here;
&this;
wherever these appear in the element (attributes or content), they will be replaced with the current item of the template ( à la Mustache {{.}} )
```

#### usage

You can precompile a string (which returns the render function), or render that string straight away

```js
const render = soft.compile('<h1 :is="title"></h1>')
render({
    title: 'an amazing title' 
}).toDOM()

soft.render('<h1 :is="title"></h1>', {
   title: 'another amazing title' 
}).toString()
```

#### data

Soft can handle almost anything you place in your templates: synchronous values, callbacks, Promises and generators

#### configurable and extensible

```js
soft.configure({
  helpers: {
    caps(val, token) {
      return val.toUpperCase()
    } 
  },
  attributes: {
    inline(attrs, token) {
      return fetch(attrs.src).then(res => res.text())
    }
  },
  prefix: 'soft:' // soft:is, soft:of ...
  ext: 'soft' // default extension
})
```

#### examples

using template:

```json
{
    "something": "soft.js",
    "array": [1,2,3],
    "objects": [{
        "foo": 1,
        "bar": 2
    },{
        "foo": 3,
        "bar": 4
    }]
}
```

these:

```html
<p :is="something"></p>
```

```html
<li :of="array"></li>
```

```html
<li :of="array">item &self;</li>
```

```html
<li :of="objects" data-bar="&self[bar];" data-foo="&self.foo;">(&self.bar;, &self[foo];)</li>
```

become:

```html
<p>soft.js</p>
```

```html
<li>1</li>
<li>2</li>
<li>3</li>
```

```html
<li>item 1</li>
<li>item 2</li>
<li>item 3</li>
```

```html
<li data-bar="2" data-foo="1">(2, 1)</li>
<li data-bar="4" data-foo="3">(4, 3)</li>
```
