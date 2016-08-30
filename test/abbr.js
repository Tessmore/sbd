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


    describe('Skip two worded abbreviations', function () {
        var entry = "Claims 1–6 and 15–26 are rejected under pre-AIA 35 USC § 103(a) as being unpatentable over Chalana et al. (US 2012/0179503) in view of Oh (US 2013/0013993).";
        var sentences = tokenizer.sentences(entry);

        it("should get 1 sentence", function () {
            assert.equal(sentences.length, 1);
        });
    });


    describe('Skip two worded abbreviations', function () {
        var entry = "Et al. is an abbreviation of the Latin loanphrase et alii, meaning and others. It is similar to etc. (short for et cetera, meaning and the rest), but whereas etc. applies to things, et al. applies to people.";
        var sentences = tokenizer.sentences(entry);

        it("should get 2 sentences", function () {
            assert.equal(sentences.length, 2);
        });
    });

    describe('Use other languages', function () {
        var entry = "Trzeba tu coś napisać, np. fragment odnoszący się do pkt. 3 wcześniejszego tekstu.";
        var sentencesEN = tokenizer.sentences(entry);
        var sentencesPL = tokenizer.sentences(entry,{abbreviations:["np","pkt"]});


        it("should get 1 sentence", function () {
            // console.log("#",sentencesEN, sentencesPL, sentencesPL.length)
            assert.equal(sentencesEN.length, 3);
            assert.equal(sentencesPL.length, 1);
        });

        it("should not permanently override abbreviations", function() {
            var sentences = tokenizer.sentences(entry);
            assert.equal(sentences.length, 3);
        })
    });
});
