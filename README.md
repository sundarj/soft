### soft [![Build Status](https://travis-ci.org/sundarj/soft.svg?branch=rewrite)](https://travis-ci.org/sundarj/soft)
unobtrusive html-esque templating engine


#### about

Soft is an extensible templating engine that aims to be as close to plain HTML as possible. Using a few elements and some attributes (and no curly-braces), it aims to be simple and expressive.

#### syntax

Soft uses three basic types of expression: elements, attributes, and entities which can be plugged in to an existing HTML document with minimal visual change, and follow the same syntax.

#### elements

```html
<import src="file/to/import" escaped?>
<include src="file/to/import" escaped?>
imports a file into the current document

<if object>
<if thing="value">
starts an if block

<else>
starts an else block

<endif>
<fi>
ends an if block
```

#### attributes

```html
<element :is="title">
insert the content from the template under the "title" key into the element

<element :of="array">
iterate over `somearray`, creating a new element for each item

<element :of|:is :as="currency">
<element :of|:is :as="currency | bold">
use the `currency` helper on the content from the template matching this element
multiple helpers can be provided, delimited by the `|` character

<element :void>
do not fill in this element's content (used for void elements such as <img> where you only want attributes to be filled in)
```

#### entities

```html
&self;
&here;
&this;
wherever these appear in the element (attributes or content), they will be replaced with the current item of the template ( à la Mustache {{.}} )
```


#### usage

Soft can compile a string, or render that string in realtime; the choice is yours.

```js
# compiling
var render = soft.compile('<h1 :is="title"></h1>');
render({
    title: 'an amazing title' 
});

# realtime
soft.render('<h1 :is="title"></h1>', {
   title: 'another amazing title' 
});
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
<li :of="objects">(&self.bar;, &self[foo];)</li>
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
<li>(2, 1)</li>
<li>(4, 3)</li>
```
