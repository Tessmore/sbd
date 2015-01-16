/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Empty', function () {

  describe('string', function () {
      var entry = "";
      var sentences = tokenizer.sentences(entry);

      it('should not get a sentence', function () {
          assert.equal(sentences.length, 0);
      });
  });

  describe('symbols only', function () {
      var entry = "^&%(*&";
      var sentences = tokenizer.sentences(entry);

      it('should not single entry', function () {
          assert.equal(sentences.length, 1);
      });
  });

});