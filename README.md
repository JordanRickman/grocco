# Grocco - Full-Text Documentation Generator

**Grocco** is a full-text documentation generator and literate programming build-chain tool. Grocco uses
[Markdown](http://daringfireball.net/projects/markdown/syntax)-based syntax,
and runs on [node](https://nodejs.org). It targets JavaScript, but supports any programming language.

_Full-text documentation_ means that each source file becomes a prose document. Your comments form the text of the
document, and the full source code is included alongside - either inline, or in a two-panel layout.
Full-text documentation is not for API references, but for tutorials, guides, and explaining your code to other
developers. It is very much in the style of "literate programming," but Grocco does not require strict
literate programming style.

In particular, literate programming encourages writing code _within_ documents - contemporary practitioners often use
Markdown code blocks, requiring an extra compilation step to extract code from the Markdown document.
Fortunately, Grocco does not require this - you can write your prose in regular code comments. Fortunately
for literate programmers, Grocco does _support_ it, and in fact can be used in your build scripts to convert Markdown
documents into compilable source files.

Grocco is named after [Docco](https://jashkenas.github.io/docco/) and its clone [Groc](https://github.com/nevir/groc).
Both are robust tools, and Docco remains a major player among JS documentation generators. However, neither are
actively maintained. Grocco aims to provide a richer featureset than these predecessors, and to be more configurable
and extensible than is allowed by Docco's "quick-and-dirty" implementation.

## (Planned) Features

* Recursive processing of directories, and extended globbing support
* Supports literate programming (Markdown documents with a full program in code blocks)
* Supports line and block comments, including inline and end-of-line comments
* Supports any programming language for which comment boundaries can be matched by a regular expression
* Control over which comments are processed as prose
  - Great for using Grocco alongside an API documentation generator like [JSDoc](http://usejsdoc.org/)
    - JSDoc/JavaDoc comments (`/** ... */`) are excluded by default
  - Configurable patterns for...
    - _Passthrough_ - comments that should be displayed in the code area of the generated documentation
    - _Excluding_ - comments that should be removed entirely
    - _Whitelisting_ - in whitelist mode, only certain comments are processed by Grocco
      - passthrough comments behave the same, and all other comments are excluded
* Github-flavored Markdown support, via [Marked](https://github.com/chjj/marked)
* Syntax highlighting
  - can specify language on a code-block level as in Github-flavored Markdown
* Outputs to HTML or just plain Markdown
* Inline and side-by-side HTML templates included, or roll your own
  - Default template allows expanding/collapsing of code sections
* Special directives for...
  - Code sections that should be collapsed by default
  - Code sections that should be excluded entirely from the generated documentation
  - In literate source files, code blocks to exclude from the compilable output
    - allows you to include code blocks in another language than your program - e.g., examples of command line usage
* JSON configuration files - per-project (`grocco.json`) and per-directory (`.grocco.json`)
* **Stretch Goals**
  - Automatic management of internal links
  - Automatic generation of anchors for headings

## Pipeline

To better understand Grocco and help configure it for your needs, here is an overview of the Grocco
processing pipeline.

_**Source -> Markdown -> JSON -> HTML**_

**Source** Source code files, either literate or regular source code. This is what you write.

**Markdown** Markdown files in a Github-compatible format. If you are outputting Markdown, processing stops here.

**JSON** JSON files containing all the information Grocco needs to render a template. If you plan to make your own
templates, you'll need to understand this data format.

- [ ] insert a link to the documentation for the JSON format, once you have it

**HTML** Final html output (with embedded JavaScript).

### Processing Phases

#### Source -> Markdown

Excluded comments and source code blocks are removed. For literate source files, nothing else is changed. For regular
source files, code and prose are swapped - the source file is converted into a literate source file. Grocco-specific
directives are wrapped in HTML comments (`<!-- ... -->`), preserving compatibility with other Markdown processors.

#### Markdown -> JSON

The Markdown document is minimally parsed in order to detect code blocks. Each block of prose is paired with the
block of code it precedes, allowing for alignment in side-by-side layout. Each such pair, along with some metadata, forms a _section_ object that is stored in a JSON array (itself wrapped in a JSON document with some additional metadata). Markdown headings also signal a new section - sections need not contain a code block.

#### JSON -> HTML

Markdown text is passed through the Marked library to render HTML, and inserted into the template. Code blocks are passed through [Highlight.js](https://highlightjs.org/). Metadata on each section is available to the template.

- [ ] More details on how templates are rendered and described. Handlebars? Handlebars-style using Underscore.js?
  A JavaScript API? Some combination thereof?
