/*
# Configuration Handler

This module contains code for reading configuration files, as well as the default configuration values.
Configuration files are JSON files and may exist on a per-project or per-directory basis.
At the project level, the configuration file is `grocco.json`. Within a given source directory, it is `.grocco.json`
and applies to all files in that directory and any subdirectories, recursively, a la `.htaccess`. Any values
specified in a `.grocco.json` will override those from any ancestor directories and those at the project level.

*/

export default class Config {

  /*
  ### Constructor

  `path` is the (string) filepath for the file we are processing.
  `base` is a base configuration (from project or parent).
  */
  constructor(path, base) {
    // No-argument constructor returns default configuration
    // **TODO** Clone before returning. Deep copy needed? Depends on object structure.
    if (!path && !base)
      return this.DEFAULTS;
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
        // When using a regexp, you **must** capture the comment boundary in the _first_ capture group.
        /(\/\/+<>)/, /(\/\*+<>)/
      ],
      whitelistCommentStart: [
        "///",
        "/***"
      ],
      // Passthrough comments begin with '//-' or '/*-', followed by whitespace.
      passthroughCommentStart: /((?:\/\/+|\/\*+)-)\s/
    },
    {
      name: "CoffeeScript",
      sourceExtensions: "coffee",
      allowLiterate: true, // supports \*.coffee.md in _addition_ to \*.litcoffee
      literateExtensions: "litcoffee",
      highlightjsLangName: "coffeescript",
      lineCommentStart: /(#)[^{]/,
      blockCommentStart: "###",
      blockCommentEnd: "###",
      excludeCommentStart: [
        "###*", // CoffeeScript will compile this to `/**` (JSDoc comment block)
        /(#+<>)/
      ],
      whitelistCommentStart: /(#+-)\s/
    }
  ]
}
