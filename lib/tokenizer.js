/*jshint node:true, laxcomma:true */
"use strict";

var sugar = require('sugar');
var abbreviations = require('../data/abbr').abbreviations;

// input: dot_index = position of a "." symbol
function is_number(str, dot_index) {
    if (dot_index) {
        str = str.slice(dot_index-1, dot_index+2);
    }

    return !isNaN(str);
}

// Phone number matching
// http://stackoverflow.com/a/123666/951517
function is_phone_nr(str) {
    return str.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
}

// Match urls / emails
// http://stackoverflow.com/a/3809435/951517
function is_url(str) {
    return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
}

String.prototype.ends_with_char = function(c) {
    if (c.length > 1) {
        return c.indexOf(this.slice(-1)) > -1;
    }

    return this.slice(-1) === c;
};

String.prototype.ends_with = function(end) {
    return this.slice(this.length - end.length) === end;
};

String.prototype.is_dotted_abbreviation = function() {
    return this.match(/(.[.])*/)[0].length > 0;
}

function is_ending(word) {
    var i = 0;

    if (word === "." || word === "!" || word === "?") {
        return true;
    }

    if (word.ends_with_char("?!")) {
        return true;
    }

    // A dot might indicate the end of a sentence
    if (word.ends_with_char('.')) {

        // Single characters + dot are considered abbreviations
        if (word.length === 2) {
            return false;
        }

        // Custom dotted abbreviations (like K.L.M or I.C.T)
        if (word.is_dotted_abbreviation()) {
            return false;
        }

        // Check for abbreviations
        if (abbreviations.indexOf(word.slice(0, -1)) > -1) {
           return false;
        }

        return true;
    }

    // Check if the word has a dot in it
    if ((i = word.indexOf(".")) > -1) {
        if (is_number(word, i)) {
            return false;
        }

        // Custom dotted abbreviations (like K.L.M or I.C.T)
        if (word.is_dotted_abbreviation()) {
            return false;
        }

        // Skip urls / emails and the like
        if (is_url(word) || is_phone_nr(word)) {
            return false;
        }

        // Starting a new sentence if beginning with capital letter
        var c = word.charAt(i + 1);
        if (c === c.toUpperCase())
            return true;
    }

    return false;
}

// Split the entry into sentences.
exports.sentences = function sentences(text) {
    var words = text.words();
    var sentences = [];
    var current   = [];

    for (var i in words) {
        // Add the word to current sentence
        current.push(words[i]);

        if (is_ending(words[i])) {
            sentences.push(current.join(" "));
            current = [];
        }
    }

    if (current.length)
        sentences.push(current.join(" "));

    return sentences;
};