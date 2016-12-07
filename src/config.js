/*
# Configuration Handler

This module contains code for reading configuration files, as well as the default configuration values.

Configuration files are JSON files and may exist on a per-project or per-directory basis.
At the project level, the configuration file is `grocco.json`. Within a given source directory, it is `.grocco.json`
and applies to all files in that directory and any subdirectories, recursively, a la `.htaccess`. Any values
specified in a `.grocco.json` will override those from any ancestor directories and those at the project level.

*/
'use strict'

var util = require('./util'); //<!--!<>-->

class Config {

  /*
  ### Constructor

  `path` is the (string) filepath for the file we are processing.
  `base` is a base configuration (from project or parent).
  */
  constructor(path, base) {
    // No-argument constructor returns default configuration
    if (!path && !base)
      return util.cloneJSON(Config.DEFAULTS);
  }

}

// ## Configuration Options and Defaults
Config.DEFAULTS = {
  whitelist: false, // Whitelist mode - only treat comments matching whitelist pattern as prose.

  literateExtension: "md", // Append to a source file name to treat as literate

  languages: [
    {
      name: "JavaScript",
      sourceExtensions: "js", // or array of strings
      allowLiterate: true, // treat as literate when \*.js.md
      highlightjsLangName: "javascript",

      // Comment-matching patterns may be defined as strings or regexps
      lineCommentStart: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",

      // Each pattern here must begin with lineCommentStart or blockCommentStart
      excludeCommentStart: [
        "/**", // Ignore JSDoc comments

        // Because JSON does not support regular expressions, you define them by
        // an object with a single attribute that is the pattern for the regexp.
        // Each will be passed directly to `new RegExp(...)`. Be careful with
        // backslash - you will have to double it b/c this is a string literal.
        //
        // You may also specify a string attribute called "flags", also passed
        // directly to the RegExp constructor. However, note that using the
        // "global", "multiline", or "sticky" flags is inappropriate and may
        // cause unpredictable behavior.
        //
        // **When using a regexp, you _must_ capture the comment boundary in the _first_ capture group.**
        { pattern: "(\\/\\/+<>)" },
        { pattern: "(\\/\\*+<>)" }
      ],
      whitelistCommentStart: [
        "///",
        "/***"
      ],
      // Passthrough comments begin with '//-' or '/*-', followed by whitespace.
      passthroughCommentStart: { pattern: "((?:\\/\\/+|\\/\\*+)-)\\s" }
    },
    {
      name: "CoffeeScript",
      sourceExtensions: "coffee",
      allowLiterate: true, // supports \*.coffee.md in _addition_ to \*.litcoffee
      literateExtensions: "litcoffee",
      highlightjsLangName: "coffeescript",
      lineCommentStart: { pattern: "(#)[^{]" },
      blockCommentStart: "###",
      blockCommentEnd: "###",
      excludeCommentStart: [
        "###*", // CoffeeScript will compile this to `/**` (JSDoc comment block)
        { pattern: "(#+<>)" }
      ],
      whitelistCommentStart: { pattern: "(#+-)\\s" }
    }
  ]
}
module.exports = Config;
