/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Abbreviations in sentences', function () {

    describe('Skip dotted abbreviations', function () {
        var entry = "Lorem ipsum, dolor sed amat frequentor minimus In I.C.T we have multiple challenges! There should only be two sentences.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Skip dotted abbreviations (B)', function () {
        var entry = "From amat frequentor minimus hello there at 8 a.m. there p.m. should only be two sentences.";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('Skip dotted abbreviations (C)', function () {
        var entry = "The school, called Booker T and Stevie Ray\'s Wrestling and Mixed Mart Arts Academy, will have an open house 2-6 p.m. Saturday.";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
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