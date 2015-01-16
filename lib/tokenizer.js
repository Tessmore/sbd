/*jshint node:true, laxcomma:true */
"use strict";

var sanitizeHtml = require('sanitize-html');

var String = require('./String');
var Match  = require('./Match');

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();

// Split the entry into sentences.
exports.sentences = function(text, newline_boundary) {

    if (text.length === 0)
        return [];

    text = sanitizeHtml(text, { "allowedTags" : [] });

    var index = 0;
    var temp  = [];

    /** Preprocessing */
    if (typeof newline_boundary === 'undefined') {
        newline_boundary = false;
    }

    if (newline_boundary) {
        text = text.replace(/\n+/g, newline_placeholder);
    }

    // Split the text into words
    var words = text.match(/\S+/g); // see http://blog.tompawlak.org/split-string-into-tokens-javascript
    var sentences = [];
    var current   = [];

    for (var i=0, L=words.length; i < L; i++) {
        // Add the word to current sentence
        current.push(words[i]);

        if (Match.isBoundaryChar(words[i])      ||
            String.endsWithChar(words[i], "?!") ||
            words[i] === newline_placeholder_t)
        {
            if (newline_boundary) {
                current.pop();
            }

            sentences.push(current);
            current = [];

            continue;
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (String.endsWithChar(words[i], '.')) {
            // Check if the word is in the abbreviation list (without symbols)

            if (Match.isCommonAbbreviation(words[i])) {
               continue;
            }

            // Check if there is a next word
            if (i+1 < L) {
                // This should be improved with machine learning

                // Next word starts with capital word, but current sentence is
                // quite short
                if (Match.isSentenceStarter(words[i+1])) {
                    if (current.length < 6) {
                        // Custom dotted abbreviations (like K.L.M or I.C.T)
                        if (Match.isDottedAbbreviation(words[i]) || Match.isCustomAbbreviation(words[i])) {
                            continue;
                        }
                    }
                }
                else {
                    // Skip ellipsis
                    if (String.endsWith(words[i], "..")) {
                        continue;
                    }

                    // Skip abbreviations
                    if (Match.isDottedAbbreviation(words[i]) || Match.isCustomAbbreviation(words[i])) {
                        continue;
                    }
                }
            }

            sentences.push(current);
            current = [];
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
            current.push(temp[1]);
        }
    }

    if (current.length)
        sentences.push(current);

    /** After processing */
    var result   = [];
    var sentence = "";

    // Clear empty values
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
