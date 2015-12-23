/*jshint node:true, laxcomma:true */
"use strict";

var sanitizeHtml = require('sanitize-html');

var String = require('./String');
var Match  = require('./Match');

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();

// Split the entry into sentences.
exports.sentences = function(text, options) {
    if (text.length === 0)
        return [];

    /** Options processing */
    var newline_boundary;
    var do_sanitize = true;
    if (typeof options === 'undefined') {
        newline_boundary = false;
    }
    else if (typeof options === 'object') {
      newline_boundary = options.newline_boundary || false;
      do_sanitize = typeof options.sanitize === 'undefined' ? true : options.sanitize;
    }
    else {
        newline_boundary = options;
    }

    text = do_sanitize ? sanitizeHtml(text, { "allowedTags" : [''] }) : text;

    if (newline_boundary) {
        text = text.replace(/\n+|[-#=_+*]{4,}/g, newline_placeholder);
    }

    var index = 0;
    var temp  = [];

    // Split the text into words
    var words = text.match(/\S+/g); // see http://blog.tompawlak.org/split-string-into-tokens-javascript

    var sentences = [];
    var current   = [];

    var wordCount = 0;

    for (var i=0, L=words.length; i < L; i++) {
        wordCount++;

        // Add the word to current sentence
        current.push(words[i]);

        // Sub-sentences (Bijzin?), reset counter
        if (~words[i].indexOf(',')) {
            wordCount = 0;
        }

        if (Match.isBoundaryChar(words[i])      ||
            String.endsWithChar(words[i], "?!") ||
            words[i] === newline_placeholder_t)
        {
            if (newline_boundary && words[i] === newline_placeholder_t) {
                current.pop();
            }

            sentences.push(current);

            wordCount = 0;
            current   = [];

            continue;
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (String.endsWithChar(words[i], '.')) {

            // Check if there is a next word
            if (i+1 < L) {
                // This should be improved with machine learning

                // Single character abbr.
                if (words[i].length === 2 && isNaN(words[i].charAt(0))) {
                    continue;
                }

                // Common abbr. that often do not end sentences
                if (Match.isCommonAbbreviation(words[i])) {
                    continue;
                }

                // Next word starts with capital word, but current sentence is
                // quite short
                if (Match.isSentenceStarter(words[i+1])) {
                    if (Match.isTimeAbbreviation(words[i], words[i+1])) {
                        continue;
                    }

                    // Dealing with names at the start of sentences
                    if (Match.isNameAbbreviation(wordCount, words.slice(i, 6))) {
                        continue;
                    }

                    if (Match.isNumber(words[i+1]) && Match.isCustomAbbreviation(words[i])) {
                        continue;
                    }
                }
                else {
                    // Skip ellipsis
                    if (String.endsWith(words[i], "..")) {
                        continue;
                    }

                    //// Skip abbreviations
                    // Short words + dot or a dot after each letter
                    if (Match.isDottedAbbreviation(words[i]) || Match.isCustomAbbreviation(words[i])) {
                        continue;
                    }
                }
            }

            sentences.push(current);
            current   = [];
            wordCount = 0;

            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[i].indexOf(".")) > -1) {
            if (Match.isNumber(words[i], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (Match.isDottedAbbreviation(words[i])) {
                continue;
            }

            // Skip urls / emails and the like
            if (Match.isURL(words[i]) || Match.isPhoneNr(words[i])) {
                continue;
            }
        }

        if (temp = Match.isConcatenated(words[i])) {
            current.pop();
            current.push(temp[0]);
            sentences.push(current);

            current = [];
            wordCount = 0;
            current.push(temp[1]);
        }
    }

    if (current.length)
        sentences.push(current);

    /** After processing */
    var result   = [];
    var sentence = "";

    // Clear "empty" sentences
    sentences = sentences.filter(function(s) {
        return s.length > 0;
    });

    for (i=0; i < sentences.length; i++) {
        sentence = sentences[i].join(" ");

        // Single words, could be "enumeration lists"
        if (sentences[i].length === 1 && sentences[i][0].length < 4 &&
            sentences[i][0].indexOf('.') > -1)
        {
            // Check if there is a next sentence
            // It should not be another list item
            if (sentences[i+1] && sentences[i+1][0].indexOf('.') < 0) {
                sentence += " " + sentences[i+1].join(" ");
                i++;
            }
        }

        result.push(sentence);
    }

    return result;
};
