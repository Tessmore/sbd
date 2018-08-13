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

    describe('It should properly join single-word list sentences', function () {
        var entry = "iv. determining that the advertisement in the lift study is a candidate ad for the user, computing whether to include the user in a test group or a control group for the lift study ([0032]), v. based on the computation indicating that the user is in the control group, holding out the advertisement from completing the ad selection process for the user ([0032]), and vi. based on the computation indicating that the user is in the test group, allowing the advertisement to continue through the ad selection process such that the user receives either the advertisement in the lift study or another advertisement ([0032]); and ";
        var sentences = tokenizer.sentences(entry, options);

        it("should get the correct sentences", function () {
            assert.deepEqual(sentences, [
              "iv. determining that the advertisement in the lift study is a candidate ad for the user, computing whether to include the user in a test group or a control group for the lift study ([0032]), v. based on the computation indicating that the user is in the control group, holding out the advertisement from completing the ad selection process for the user ([0032]), and vi. ",
              "based on the computation indicating that the user is in the test group, allowing the advertisement to continue through the ad selection process such that the user receives either the advertisement in the lift study or another advertisement ([0032]); and "
            ]);
        });
    });
});
