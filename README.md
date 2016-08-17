# showdown.js

A simple slideshow for markdown files using vanilla JS

A demo (viewing this readme) can be seen by visiting:

[https://thegecko.github.io](https://thegecko.github.io)

# Traversal

You can click/tap the screen or swipe left or right to control the slideshow.

It will automatically go to full screen instead of advancing the first slide.

Use the following keys to show the next slide:
* SPACE
* RETURN
* RIGHT
* DOWN

And these keys to show the previous one:
* BACKSPACE
* LEFT
* UP

# Display

A markdown file can be shown in multiple ways.

## Github gists

Find the gist on github you want to show and simply replace the URL subdomain with `thegecko`

e.g.

```
https://gist.github.com/[username]/[gist]
```

becomes:

```
https://__thegecko__.github.com/[username]/[gist]
```

## Markdown from the interwebs

Find the markdown file URL and add `https://thegecko.github.com?` to the beginning.

e.g.

```
https://thegecko.github.com?[URL to your markdown]
```

## Host it yourself

Fork this repo and host your own slideshow and markdown. This gives you the added benefit of styling the show.

See the `options` section for more information.

# Formatting your files

To mark the beginning of a new slide, use the `#` (Header 1) marker.

[Standard markdown](https://en.wikipedia.org/wiki/Markdown) (without extensions) is supported including:

`#` header 1 (as seen in the slide title)
## `##` header 2
### `###` header 3
#### `####` header 4
##### `#####` header 5
###### `######` header 6

__bold (using underscores)__ and ***bold (using stars)***

_italic (using underscores)_ and *italic (using stars)*

[links](http://thegecko.org)

Images:

![bleat](https://thegecko.github.io/bleat/images/bleat.png)

`inline code` ```using backticks```

and

```
multiline code
using backticks
```

> multiline
> blockquotes

* list item 1
* list item 2
 * sub list item 1
  * sub-sub list item 1
 * sub list item 2
* list item 3
 1. ordered list item 1
 2. ordered list item 2

# Options

You can create a `window.options` object in your own copy of this code to control some aspects of the slideshow:

```
{
    elementName: "showdown", // the id of the element to render slides into
    file: "/README.md", // the URL of the markdown file to render
    slide: 1 // the slide to begin the slideshow on
}
```