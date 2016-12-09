/*
# File Parser

This parser is the meat of Grocco. It reads a source code file line-by-line, generating 0 or more output lines for each input line.
Each output line is either prose or code.

*/

var _ = require('underscore');

/*
## ParserModeEnum

Singleton enum object - each possible value is an all-caps property, and can be compared with `===`.

Also provides some helper methods.
*/
const ParserModeEnum = function() {
  this.CODE = 'code';
  this.MULTILINE_PROSE = 'multiline-prose';
  this.MULTILINE_EXCLUDE = 'multiline-exclude';

  // Get the mode to start in.
  this.startMode = function() {
    return this.CODE;
  };

  // Are we in a multiline comment?
  this.isMultlineComment(parserMode) {
    return (parserMode === this.MULTILINE_PROSE || parserMode === this.MULTILINE_EXCLUDE);
  };

  return this;
}();

/*
## LineTypeEnum

Singleton enum object - each possible value is an all-caps property, and can be compared with `===`.
*/
const LineTypeEnum = function() {
  this.BLANK = 'blank';
  this.CODE = 'code';
  this.PROSE = 'prose';

  return this;
}();

class Parser {

  // **TODO** NOT object-oriented? Or move the iterating out of this file?
  // ## Constructor
  // - **file** A file to parse, as an array of lines (strings)
  // - **config** An instance of Config.
  // - **language** Configuration for the language to use; an element of `config.languages`.
  constructor(file, config, language) {
      // TODO
      this.config = config;
      this.lang = language;
      return _.chain(this)
              .map(this.parse, this)
              .flatten().value();
  }

  // ## Parsing Algorithm
  //
  // Possibilities for each line:
  //
  // 1. **Blank Line** With or without a comment, passes through to a blank line of Markdown.
  // 2. **Line Comment** Begins with a line comment, no code.
  // 3. **

  // 1. `  //` or `  ` - blank line
  // 2. `  // blah blah blah` or ` /* blah blah blah */`- prose line
  // 3. `  foo(x + 2); // we need to add 2 because...` - prose line, THEN code line - end-of-line comments precede the line they describe
  // 4. `  foo(x + 2); /* we need to add 2 because... */` - prose line, then code line
  // 5. `  foo(x + /* add 2 b/c... */ 2);` - code line - multiline comments within code are passthrough
  // 6. `  foo(x + 2); /* we need to add 2 because... ` - code line, THEN prose line - begin multiline comment
  // 7. `  /* This method...  ` - prose line, begin multiline comment
  // 8. `  /* ` - blank line, begin multiline comment
  // 11. ` //- blah blah blah ` or ` /*- blah blah blah ` - code line - passthrough comment
  // 12. ` foo(x + 2); //- we need to add 2 because... ` - code line
  // 9. `  /** @type MyType... */ ` - skip
  // 10. ` /** ` or ` /** @type... ` - skip, begin multiline skipped comment
  // 13. ` foo(x + /** exclude this comment */ 2);` - code line - TODO chop the comment out?
  // 14. ` foo(x + 2); /** @type ...` - code line, chop the comment out, begin multiline skipped comment

  // parseLine(string, boolean) -> [ { type: LineTypeEnum, contents: string } ]
  parseLine(line, startIndex, parserMode) {
    // TODO Handle other parser modes (within multiline comment)

    if (/\s*/.test(line))
      return [ { type: LineTypeEnum.BLANK } ];

    // Search for comment boundaries - split into [before, boundary, after], or empty array if no line comment
    var lineCommentSplit = splitOnPattern(line, this.lang.lineCommentStart, startIndex);
    var blockCommentSplit = splitOnPattern(line, this.lang.)
    var passthroughCommentSplit = splitOnPattern(line, this.lang.passthroughCommentStart, startIndex);
    var excludeCommentSplit = splitOnPattern(line, this.lang.passthroughCommentStart, startIndex);
    if (lineCommentSplit.length > 0) {
      if (excludeCommentSplit.length === 0 || !_.isEqual(lineCommentSplit, excludeCommentSplit)) {
        if (passthroughCommentSplit.length === 0 || !_.isEqual(lineCommentSplit, passthroughCommentSplit)) {
          // A line comment by itself
          if (/\s*/.test(lineCommentSplit[0]))
            return [ { type: LineTypeEnum.PROSE, contents: lineCommentSplit[2] } ];

          // An end-of-line comment - put the comment above the line it describes
          else
            return [ { type: LineTypeEnum.PROSE, contents: lineCommentSplit[2] },
                     { type: LineTypeEnum.CODE, contents: lineCommentSplit[0] } ];
        }
        // A passthrough end-of-line comment - treat the whole line as code
        else if (passthroughCommentSplit.length > 0 || !_.isEqual(lineCommentSplit, passthroughCommentSplit)) {
          return [ { type: LineTypeEnum.CODE, contents: line } ];
        }
        else throw new Error("FATAL: Bad result from Parser.splitOnPattern");
      }
      // An excluded end-of-line comment - only return the code, chopping the comment off
      else if (_.isEqual(lineCommentSplit, excludeCommentSplit)) {
        return [ { type: LineTypeEnum.CODE, contents: lineCommentSplit[0] }];
      }

    }
    //- All branches inside if if block return or throw - no need for else

    }

  }

  // ### splitOnPattern
  //
  // `splitOnPattern(object, object, int) -> [] or [string, string, string]`
  //
  // Splits a line using start-of-comment boundary-matching patterns. As per the documentation in the Config class
  // (see Config.DEFAULTS in particular), a pattern can either be a string or a RegExp, but RegExps are stored in the
  // form { pattern: string, flags: string } in order to read them from JSON.
  //
  // Starts searching the line at the given index. If no match for the pattern is found, returns an empty array.
  // If the pattern is found, returns a list of three strings:
  //
  // 1. The line up to the boundary (match of the pattern)
  // 2. The text of the matched boundary - for RegExp patterns, uses the contents of the first capture group
  // 3. The remainder of the line
  splitOnPattern(line, pattern, index) {
    // TODO pattern may be a list
    if (typeof(pattern) === 'string') {
      var startIndex = line.slice(index).indexOf(pattern);
      if (startIndex === -1)
        return [];
      startIndex = index + startIndex;
      var endIndex = startIndex + pattern.length;
      return [line.slice(0, startIndex), line.slice(startIndex, endIndex), line.slice(endIndex)];
    } else if (typeof(pattern) === 'object' && typeof(pattern.pattern) === 'string') {
      var patternRegExp = new RegExp(pattern.pattern, pattern.flags);
      var match = patternRegExp.exec(line.slice(index));
      if (match === null)
        return [];
      var startIndex = index + match.index;
      var endIndex = startIndex + match[1].length;
      return [line.slice(0, startIndex), line.slice(startIndex, endIndex), line.slice(endIndex)];
    }
    else throw Error("FATAL: Bad argument to Parser.splitOnPattern");
  }
}
