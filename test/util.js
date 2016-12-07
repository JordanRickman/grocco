'use strict';

var util = require('../src/util');
var assert = require('assert');

describe('util', function() {
  describe('cloneJSON', function() {
    it("should not clone undefined", function() {
      assert.throws(function(){
        util.cloneJSON(undefined);
      }, TypeError);
      assert.throws(function(){
        util.cloneJSON();
      }, TypeError);
    });
    it("should clone null", function() {
      assert.strictEqual(util.cloneJSON(null), null);
    });
    it("should clone a string", function() {
      assert.strictEqual(util.cloneJSON('Hello'), 'Hello');
    });
    it("should clone a number", function() {
      assert.strictEqual(util.cloneJSON(2), 2);
    });
    it("should clone a boolean", function() {
      assert.strictEqual(util.cloneJSON(true), true);
      assert.strictEqual(util.cloneJSON(false), false);
    });
    it("should clone an array", function() {
      var arr = [1, 2, 3, "abc"];
      assert.deepStrictEqual(util.cloneJSON(arr), arr);
    });
    it("should clone a depth-1 object", function() {
      var obj = {a: "a", b: 2, c: "The letter C"};
      assert.deepStrictEqual(util.cloneJSON(obj), obj);
      assert.notStrictEqual(util.cloneJSON(obj),obj);
    });
    it("should clone a depth-n object", function() {
      var obj = {
        a: {
          b: 0,
          c: 1,
          d: "d"
        },
        letsNestSomeArrays: {
          contents: [
            {
              name: "Larry",
              goat: true
            },
            {
              name: "Joe",
              goat: false
            }
          ]
        },
      };
      assert.deepStrictEqual(util.cloneJSON(obj), obj);
      assert.notStrictEqual(util.cloneJSON(obj),obj);
    });
  });
});
