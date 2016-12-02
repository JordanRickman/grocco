// # Utils Class
// Versatile functions for common use.

// export a stateless wrapper object - functional interface
module.exports = {

  // ## cloneJSON
  // Clone an object, retaining all JSON-able properties.
  cloneJSON: function(obj) {
    if (typeof(obj) === 'object' || typeof(obj) === 'string'
    || typeof(obj) === 'number' || typeof(obj) === 'boolean')
      return JSON.parse(JSON.stringify(obj));
    else throw new TypeError("Cannot clone functions or undefined.");
  }
}
