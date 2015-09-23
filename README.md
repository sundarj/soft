### soft
unobtrusive html-esque templating engine


#### about

Soft is an extensible templating engine that aims to be as close to plain HTML as possible. Using a few elements and some attributes (and no curly-braces), it aims to be simple and expressive.

#### syntax

Soft uses two basic types of expression: elements and attributes, which can be plugged in to an existing HTML document, and follows the same syntax.

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

<:self>
<:this>
<:here>
placeholder element, used to provide a place to put the template content, when there is other content before or after
```

#### attributes

```html
<element :is="title">
insert the content from the template under the "title" key into the element

<element :of="array">
iterate over `somearray`, creating a new element for each item

<element :of|:is :as="currency">
use the `currency` helper on the content from the template matching this element

<element :void>
do not fill in this element's content (used for void elements such as <img> where you only want a `src` attribute to be filled in)

<element attr=":self|:this|:here">
if an element's attribute is any of these, the template content for that item will replace it.
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

```json{
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
<li :of="array">item <:self></li>
```

```html
<li :of="objects">(<:self bar>, <:self foo>)</li>
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
