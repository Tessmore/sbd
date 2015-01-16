/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('HTML markup', function () {

    describe('HTML markup is ignored', function () {
        var entry = "<p>Hello this is my first sentence.</p> <br><br>There is also a second down the page.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

});