/*jshint node:true, laxcomma:true */
"use strict";

var sugar = require('sugar');
var String = require('./String');
var Match  = require('./Match');

var abbreviations = require('../data/abbr').abbreviations;

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();

// Split the entry into sentences.
exports.sentences = function sentences(text, newline_boundary) {
    var i,index = 0;
    var temp    = [];

    /** Preprocessing */
    if (typeof newline_boundary === 'undefined') {
        newline_boundary = false;
    }

    if (newline_boundary) {
        text = text.replace(/\n+/g, newline_placeholder);
    }

    // Split the text into words
    var words = text.words();
    var sentences = [];
    var current   = [];

    for (i in words) {
        // Add the word to current sentence
        current.push(words[i]);

        if (Match.is_boundary_char(words[i]) || String.ends_with_char(words[i], "?!") || words[i] === newline_placeholder_t) {
            if (newline_boundary) {
                current.pop();
            }

            sentences.push(current);
            current = [];

            continue;
        }

        // A dot might indicate the end of a sentence
        if (String.ends_with_char(words[i], '.')) {
            // Single characters + dot are considered abbreviations
            if (words[i].length === 2) {
                continue;
            }

            /** Check for abbreviations */

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (String.is_dotted_abbreviation(words[i])) {
                continue;
            }

            // Check if the word is in the abbr. list (without
            // the period and lowercased)
            var w = words[i].toLowerCase().slice(0, -1);
            if (abbreviations.indexOf(w) > -1) {
               continue;
            }

            sentences.push(current);
            current = [];
            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[i].indexOf(".")) > -1) {
            if (Match.is_number(words[i], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (String.is_dotted_abbreviation(words[i])) {
                continue;
            }

            // Skip urls / emails and the like
            if (Match.is_url(words[i]) || Match.is_phone_nr(words[i])) {
                continue;
            }
        }

        if (temp = Match.is_concatenated(words[i])) {
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
        if (sentences[i].length === 1 && sentences[i][0].length < 4 && sentences[i][0].indexOf('.') > -1) {
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