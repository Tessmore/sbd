/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Sentences token', function () {
    describe('Only one sentence', function () {
        var entry = "Hello this is my first sentence.";
        var sentences = tokenizer.sentences(entry);

        it('should get one sentence', function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('Difficult single sentence', function () {
        var entry = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S.";
        var sentences = tokenizer.sentences(entry);

        it('should get one sentence', function () {
            console.log(sentences);
            assert.equal(sentences.length, 1);
        });
    });

    describe('Two sentences', function () {
        var entry = "Hello this is my first sentence . There is also a second.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Difficult two sentences', function () {
        var entry = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
        var sentences = tokenizer.sentences(entry);

        it('should get one sentence', function () {
            console.log(sentences);
            assert.equal(sentences.length, 2);
        });
    });

    describe('Dot in middle of word is skipped', function () {
        var entry = "Hello.this is my first sentence.";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentences", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('Dot in middle of word is not skipped if followed by capital letter', function () {
        var entry = "Hello Barney.The bird in the word.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Question- and exlamation mark', function () {
        var entry = "Hello this is my first sentence? There is also a second! A third";
        var sentences = tokenizer.sentences(entry);

        it("should get 3 sentences", function () {
            assert.equal(sentences.length, 3);
        });
    });

    describe('Questionmark is skipped inside brackets', function () {
        var entry = "A sentence [example?] that should not (Though sometimes...) be two or more (but one!) sentences.";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('Skip abbreviations', function () {
        var entry = "In I.C.T we have multiple challenges! There should only be two sentences.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('It should skip numbers', function () {
        var entry = "I paid 12.50 for that CD";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('It should skip list enumeration', function () {
        var entry = "1. The item\n2. Another item";
        var sentences = tokenizer.sentences(entry, true);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('It should skip list enumeration', function () {
        var entry = "a. The item\nzz. Another item";
        var sentences = tokenizer.sentences(entry, true);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('It should keep empty list enumeration', function () {
        var entry = "a. The item\nzz.\nab.\ncd. Hello";
        var sentences = tokenizer.sentences(entry, true);

        it("should get 4 sentences", function () {
            assert.equal(sentences.length, 4);
        });
    });

    describe('It should skip money with currency indication', function () {
        var entry = "I paid €12.50 for that CD";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('It should skip phone numbers', function () {
        var entry = "Call +44.3847838 for that CD";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('It should skip urls and emails', function () {
        var entry = "Search on http://google.com. Then send me an email: gg@gggg.kk";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('It should skip weird keywords with a dot in it', function () {
        var entry = "HELLO A.TOP IS NICE";
        var sentences = tokenizer.sentences(entry);

       it("should get 2 sentences", function () {
            assert.equal(sentences.length, 1);
        });
    });

    describe('If newlines are boundaries', function () {
        var entry = "Search on http://google.com\n\nThen send me an email: gg@gggg.kk";
        var sentences = tokenizer.sentences(entry, true);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('HTML markup is ignored', function () {
        var entry = "<p>Hello this is my first sentence.</p> <br><br>There is also a second down the page.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

});