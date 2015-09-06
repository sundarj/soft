### soft
unobtrusive html-esque templating engine


#### about

Soft is an extensible templating engine that aims to be as close to plain HTML as possible. Using a few elements and some attributes (and no curly-braces), it aims to be simple and expressive.

#### syntax

Soft uses two basic types of expression: elements and attributes, which can be plugged in to an existing HTML document, and follow the same respective syntaxes.
Syntaxes of either kind can be easily defined if needed.

#### elements

```html
<:import src="file/to/import">
<:include src="file/to/import">
imports a file into the current document

<:if object>
<:if thing="value">
starts an if block

<:else>
starts an else block

<:endif>
<:fi>
ends an if block

<:self>
<:this>
<:i>
<:here>
placeholder element, used to provide a place to put the template content, when there is other content before or after
```


#### attributes

```html
<element :is="title">
use the content from the template under the "title" key within element

<element :of="somearray">
iterate over `somearray`, creating a new element for each item

<element :as="currency">
use the `currency` helper on the content from the template matching this element (used with other attributes)

<element :void>
do not fill in this element's content (used for void elements such as <img> where you only want a `src` attribute to be filled in

<element attr=":self|:this|:i|:here">
if an element's attribute is any of these, the template content for that attribute will replace it.
```
