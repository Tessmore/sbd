/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Multiple sentences', function () {

    describe('Skip dotted abbreviations', function () {
        var entry = "Lorem ipsum, dolor sed amat frequentor minimus In I.C.T we have multiple challenges! There should only be two sentences.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Skip common abbreviations', function () {
        var entry = "Fig. 2. displays currency rates i.e. something libsum. Currencies widely available (i.e. euro, dollar, pound), or alternatively (e.g. €, $, etc.)";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });
});