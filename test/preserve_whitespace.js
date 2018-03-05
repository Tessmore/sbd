/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');
var options = { preserve_whitespace: true };


describe('Preserve whitespace', function () {
    describe('Basic', function () {
        var entry = " This is\ta  sentence   with  funny whitespace.  And this  is \tanother.\tHere  is   a third. ";
        var sentences = tokenizer.sentences(entry, options);

        it("should get 3 sentences", function () {
            assert.equal(sentences.length, 3);
        });

        it('funny whitespace is preserved in the sentences', function () {
            assert.equal(sentences.join(''), entry);
            assert.equal(sentences[0], " This is\ta  sentence   with  funny whitespace.  ");
            assert.equal(sentences[1], "And this  is \tanother.\t");
            assert.equal(sentences[2], "Here  is   a third. ");
        });
    });


    describe('No effect if newline_boundaries are specified', function () {
        var entry = " This is\ta  sentence   with  funny whitespace. ";
        var sentences = tokenizer.sentences(entry, Object.assign({ newline_boundaries: true }, options));

        it("should get 1 sentences", function () {
            assert.equal(sentences.length, 1);
        });

        it('funny whitespace is not preserved when newline_boundaries is specified', function () {
            assert.equal(sentences[0], "This is a sentence with funny whitespace.");
        });
    });


    describe('No effect if html_boundaries are specified', function () {
        var entry = " This is\ta  sentence   with  funny whitespace. ";
        var sentences = tokenizer.sentences(entry, Object.assign({ html_boundaries: true }, options));

        it("should get 1 sentences", function () {
            assert.equal(sentences.length, 1);
        });

        it('funny whitespace is not preserved when html_boundaries is specified', function () {
            assert.equal(sentences[0], "This is a sentence with funny whitespace.");
        });
    });
});
