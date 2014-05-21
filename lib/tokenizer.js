/*jshint node:true, laxcomma:true */
"use strict";

var sugar = require('sugar');
var abbreviations = require('../data/abbr').abbreviations;

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();


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

// Starting a new sentence if beginning with capital letter
function is_concatenated(word) {
    var i = 0;

    if ((i = word.indexOf(".")) > -1 || (i = word.indexOf("!")) > -1 || (i = word.indexOf("?")) > -1) {
        var c = word.charAt(i + 1);

        if (c === c.toUpperCase()) {
            return [word.slice(0, i), word.slice(i+1)];
        }
    }

    return false;
}

function is_boundary_char(word) {
    return word === "." ||
           word === "!" ||
           word === "?";
}

function ends_with_boundary_char(word) {
    return is_boundary_char(word)    ||
           word.ends_with_char("?!") ||
           word === newline_placeholder_t;
}

// Split the entry into sentences.
exports.sentences = function sentences(text, newline_boundary) {

    var i,index = 0;
    var temp    = [];

    if (typeof newline_boundary === 'undefined') {
        newline_boundary = false;
    }

    if (newline_boundary) {
        text = text.replace(/\n+/g, newline_placeholder);
    }

    var words = text.words();
    var sentences = [];
    var current   = [];

    for (i in words) {
        // Add the word to current sentence
        current.push(words[i]);

        if (ends_with_boundary_char(words[i])) {
            if (newline_boundary) {
                current.pop();
            }

            sentences.push(current.join(" "));
            current = [];

            continue;
        }

        // A dot might indicate the end of a sentence
        if (words[i].ends_with_char('.')) {
            // Single characters + dot are considered abbreviations
            if (words[i].length === 2) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (words[i].is_dotted_abbreviation()) {
                continue;
            }

            // Check for abbreviations
            if (abbreviations.indexOf(words[i].toLowerCase().slice(0, -1)) > -1) {
               continue;
            }

            sentences.push(current.join(" "));
            current = [];
            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[i].indexOf(".")) > -1) {
            if (is_number(words[i], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (words[i].is_dotted_abbreviation()) {
                continue;
            }

            // Skip urls / emails and the like
            if (is_url(words[i]) || is_phone_nr(words[i])) {
                continue;
            }
        }

        if (temp = is_concatenated(words[i])) {
            current.pop();
            current.push(temp[0]);
            sentences.push(current.join(" "));

            current = [];
            current.push(temp[1]);
        }
    }

    if (current.length)
        sentences.push(current.join(" "));

    return sentences;
};
