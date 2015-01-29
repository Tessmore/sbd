/*jshint node:true, laxcomma:true */
/*global describe:true, it:true */
"use strict";

var assert = require('assert');
var tokenizer = require('../lib/tokenizer');

describe('Single sentences', function () {
  describe('Basic', function () {
      var entry = "First sentence.";
      var sentences = tokenizer.sentences(entry);

      it('should get one sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Skip ellipsis', function () {
      var entry = "First sentence... another sentence";
      var sentences = tokenizer.sentences(entry);

      it('should get one sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult single sentence (A)', function () {
      var entry = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S.";
      var sentences = tokenizer.sentences(entry);

      it('should get one sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult sentence (B)', function () {
      var entry = "It happened around 5:30 p.m. in the 500 block of W. 82nd St. Investigators say Terrence Taylor, 22, and Deontrell Sloan, 17, got into an argument over money during the game.";
      var sentences = tokenizer.sentences(entry);

      it('should get 1 sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult sentence (C)', function () {
      var entry = "GARY Mayor Scott L. King has declared a 'cash crisis' and has asked city department heads to put off all non-essential spending until June.";
      var sentences = tokenizer.sentences(entry);

      it('should get 1 sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult sentence (D)', function () {
      var entry = "HOWELL, Mich. - Blissfield was only nine outs away from ending the longest winning streak";
      var sentences = tokenizer.sentences(entry);

      it('should get 1 sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult sentence (E)', function () {
      var entry = "33 FORT LAUDERDALE U.S. President George W Bush touted free trade as a means of strengthening democracy";
      var sentences = tokenizer.sentences(entry);

      it('should get 1 sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Difficult sentence (F)', function () {
      var entry = "Mike Tyler rides his bike on Del. 1 near Lewes early last month";
      var sentences = tokenizer.sentences(entry);

      it('should get 1 sentence', function () {
          assert.equal(sentences.length, 1);
      });
  });

  // Questionable behavior, but can only be fixed using ML?
  describe('Dot in middle of word is skipped', function () {
      var entry = "Hello.this is my first sentence.";
      var sentences = tokenizer.sentences(entry);

      it("should get 1 sentences", function () {
          assert.equal(sentences.length, 1);
      });
  });

  describe('Punctuation is skipped inside brackets', function () {
      var entry = "Lorem ipsum, dolor sed amat frequentor minimus with a sentence [example?] that should not (Though sometimes...) be two or more (but one!) sentences.";
      var sentences = tokenizer.sentences(entry);

      it("should get 1 sentence", function () {
          assert.equal(sentences.length, 1);
      });
  });
});