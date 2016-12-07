// # Warehouse
//
// This file contains code snippets for code that might be useful to me later.
// Yes, I know that's what version control is for, but some of this code was
// never committed, and I don't want to have to dig through Git history.
//
// Being a disused file, it should NOT be exported with the module, and has no test coverage.

// ## deepClone
// A deep object cloning function that recursively copies enumerable properties.
// It can copy primitives, arrays, Dates, RegExps, and object literals containing only those things.
// It cannot copy functions, instances or their prototypes, closures, etc.
deepClone: function(obj, copyNonOwnProperties) {
  // copyNonOwnProperties is an optional parameter
  if (copyNonOwnProperties === undefined) copyNonOwnProperties = false;

  // Return immutable things by reference.
  if (
    obj === undefined ||
    obj === null ||
    typeof(obj) === "boolean" ||
    typeof(obj) === "string" ||
    typeof(obj) === "number" ||
    (obj.constructor && obj.constructor === RegExp)
  )
    return obj;

  // Date has a copy constructor
  if (obj.constructor && obj.constructor === Date)
    return new Date(date);

  var result = {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {

    }
  }
}
