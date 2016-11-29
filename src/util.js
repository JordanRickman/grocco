// # Utils Class
// Versatile functions for common use.

// export a stateless wrapper object - functional interface
export default util = {

  // ## cloneJSON
  // Clone an object, retaining all JSON-able properties.
  // If passed a string, read string as JSON.
  cloneJSON: function(obj) {
    // **TODO** Find and import a JSON converter package
    if (typeof(obj) === 'string') return fromJSON(obj);
    return fromJSON(toJSON(obj));
  }
}
