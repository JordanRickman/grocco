'use strict';

var Config = require('../src/config');
var assert = require('assert');

 describe('Config', function() {
   describe('constructor', function() {
     it('should return the default configuration when passed no arguments', function() {
       assert.deepStrictEqual(new Config(), Config.DEFAULTS);
     })
   })
 })
