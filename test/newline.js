/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Save newlines', function () {

    describe('Basic', function () {
        var entry = "First sentence... Another list: \n - green \n - blue \n - red";
        var sentences = tokenizer.sentences(entry);

        it('second sentence should have newlines', function () {
            assert.equal(sentences[1], "Another list: \n - green \n - blue \n - red");
        });
    });

    describe('Sentence without lists', function () {
        var entry = "First sentence... Another sentence.\nThis is a new paragraph";
        var sentences = tokenizer.sentences(entry);

        it('second sentence should have newlines', function () {
            assert.equal(sentences.length, 3);
        });
    });

    describe('With option to use newlines as sentence boundaries', function () {
        var entry = "First sentence... Another list: \n - green \n - blue \n - red";
        var sentences = tokenizer.sentences(entry, { "newline_boundaries": true });

        it('second sentence should have newlines', function () {
            assert.equal(sentences.length, 5);
        });
    });
});
