(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tokenizer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var abbreviations;
var englishAbbreviations = [
    "al",
    "adj",
    "assn",
    "Ave",
    "BSc", "MSc",
    "Cell",
    "Ch",
    "Co",
    "cc",
    "Corp",
    "Dem",
    "Dept",
    "ed",
    "eg",
    "Eq",
    "Eqs",
    "est",
    "est",
    "etc",
    "Ex",
    "ext", // + number?
    "Fig",
    "fig",
    "Figs",
    "figs",
    "i.e",
    "ie",
    "Inc",
    "inc",
    "Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Sept","Oct","Nov","Dec",
    "jr",
    "mi",
    "Miss", "Mrs", "Mr", "Ms",
    "Mol",
    "mt",
    "mts",
    "no",
    "Nos",
    "PhD", "MD", "BA", "MA", "MM",
    "pl",
    "pop",
    "pp",
    "Prof", "Dr",
    "pt",
    "Ref",
    "Refs",
    "Rep",
    "repr",
    "rev",
    "Sec",
    "Secs",
    "Sgt", "Col", "Gen", "Rep", "Sen",'Gov', "Lt", "Maj", "Capt","St",
    "Sr", "sr", "Jr", "jr", "Rev",
    "Sun","Mon","Tu","Tue","Tues","Wed","Th","Thu","Thur","Thurs","Fri","Sat",
    "trans",
    "Univ",
    "Viz",
    "Vol",
    "vs",
    "v",
];

exports.setAbbreviations = function(abbr) {
    if(abbr){
        abbreviations = abbr;
    } else {
        abbreviations = englishAbbreviations;
    }
}

exports.isCapitalized = function(str) {
    return /^[A-Z][a-z].*/.test(str) || this.isNumber(str);
}

// Start with opening quotes or capitalized letter
exports.isSentenceStarter = function(str) {
    return this.isCapitalized(str) || /``|"|'/.test(str.substring(0,2));
}

exports.isCommonAbbreviation = function(str) {
    return ~abbreviations.indexOf(str.replace(/\W+/g, ''));
}

// This is going towards too much rule based
exports.isTimeAbbreviation = function(word, next) {
    if (word === "a.m." || word === "p.m.") {
        var tmp = next.replace(/\W+/g, '').slice(-3).toLowerCase();

        if (tmp === "day") {
            return true;
        }
    }

    return false;
}

exports.isDottedAbbreviation = function(word) {
    var matches = word.replace(/[\(\)\[\]\{\}]/g, '').match(/(.\.)*/);
    return matches && matches[0].length > 0;
}

// TODO look for next words, if multiple capitalized -> not sentence ending
exports.isCustomAbbreviation = function(str) {
    if (str.length <= 3) {
        return true;
    }

    return this.isCapitalized(str);
}

// Uses current word count in sentence and next few words to check if it is
// more likely an abbreviation + name or new sentence.

// ~ TODO Perhaps also consider prev. word?
exports.isNameAbbreviation = function(wordCount, words) {
    if (words.length > 0) {
        if (wordCount < 5 && words[0].length < 6 && this.isCapitalized(words[0])) {
            return true;
        }

        var capitalized = words.filter(function(str) {
            return /[A-Z]/.test(str.charAt(0));
        });

        return capitalized.length >= 3;
    }

    return false;
}

exports.isNumber = function(str, dotPos) {
    if (dotPos) {
        str = str.slice(dotPos-1, dotPos+2);
    }

    return !isNaN(str);
};

// Phone number matching
// http://stackoverflow.com/a/123666/951517
exports.isPhoneNr = function(str) {
    return str.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
};

// Match urls / emails
// http://stackoverflow.com/a/3809435/951517
exports.isURL = function(str) {
    return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
};

// Starting a new sentence if beginning with capital letter
// Exception: The word is enclosed in brackets
exports.isConcatenated = function(word) {
    var i = 0;

    if ((i = word.indexOf(".")) > -1 ||
        (i = word.indexOf("!")) > -1 ||
        (i = word.indexOf("?")) > -1)
    {
        var c = word.charAt(i + 1);

        // Check if the next word starts with a letter
        if (c.match(/[a-zA-Z].*/)) {
            return [word.slice(0, i), word.slice(i+1)];
        }
    }

    return false;
};

exports.isBoundaryChar = function(word) {
    return word === "." ||
           word === "!" ||
           word === "?";
};

},{}],2:[function(require,module,exports){

exports.endsWithChar = function ends_with_char(word, c) {
    if (c.length > 1) {
        return c.indexOf(word.slice(-1)) > -1;
    }

    return word.slice(-1) === c;
};

exports.endsWith = function ends_with(word, end) {
    return word.slice(word.length - end.length) === end;
};
},{}],3:[function(require,module,exports){

module.exports = function sanitizeHtml(text, opts) {
  // Strip HTML from Text using browser HTML parser
  if (typeof text == 'string' || text instanceof String) {
    var $div = document.createElement("DIV");
    $div.innerHTML = text;
    text =  ($div.textContent || '').trim();
  }
  //DOM Object
  else if (typeof text === 'object' && text.textContent) {
    text = (text.textContent || '').trim();
  }

  return text;
};

},{}],4:[function(require,module,exports){
/*jshint node:true, laxcomma:true */
"use strict";

var sanitizeHtml = require('sanitize-html');

var String = require('./String');
var Match  = require('./Match');

var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();


// Split the entry into sentences.
exports.sentences = function(text, user_options) {
    if (!text || typeof text !== "string" || !text.length) {
        return [];
    }

    var options = {
        "newline_boundaries"  : false,
        "html_boundaries"     : false,
        "html_boundaries_tags": ["p","div","ul","ol"],
        "sanitize"            : false,
        "allowed_tags"        : false,
        "abbreviations"       : null
    };

    if (typeof user_options === "boolean") {
        // Deprecated quick option
        options.newline_boundaries = true;
    }
    else {
        // Extend options
        for (var k in user_options) {
            options[k] = user_options[k];
        }
    }

    Match.setAbbreviations(options.abbreviations);

    if (options.newline_boundaries) {
        text = text.replace(/\n+|[-#=_+*]{4,}/g, newline_placeholder);
    }

    if (options.html_boundaries) {
        var html_boundaries_regexp = "(<br\\s*\\/?>|<\\/(" + options.html_boundaries_tags.join("|") + ")>)";
        var re = new RegExp(html_boundaries_regexp, "g");
        text = text.replace(re, "$1" + newline_placeholder);
    }

    if (options.sanitize || options.allowed_tags) {
        if (! options.allowed_tags) {
            options.allowed_tags = [""];
        }

        text = sanitizeHtml(text, { "allowedTags" : options.allowed_tags });
    }

    // Split the text into words
    // - see http://blog.tompawlak.org/split-string-into-tokens-javascript
    var words = text.trim().match(/\S+|\n/g);

    var wordCount = 0;
    var index = 0;
    var temp  = [];
    var sentences = [];
    var current   = [];

    // If given text is only whitespace (or nothing of \S+)
    if (!words || !words.length) {
        return [];
    }

    for (var i=0, L=words.length; i < L; i++) {
        wordCount++;

        // Add the word to current sentence
        current.push(words[i]);

        // Sub-sentences, reset counter
        if (~words[i].indexOf(',')) {
            wordCount = 0;
        }

        if (Match.isBoundaryChar(words[i])      ||
            String.endsWithChar(words[i], "?!") ||
            words[i] === newline_placeholder_t)
        {
            if ((options.newline_boundaries || options.html_boundaries) && words[i] === newline_placeholder_t) {
                current.pop();
            }

            sentences.push(current);

            wordCount = 0;
            current   = [];

            continue;
        }


        if (String.endsWithChar(words[i], "\"") || String.endsWithChar(words[i], "”")) {
            // endQuote = words[i].slice(-1);
            words[i] = words[i].slice(0, -1);
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (String.endsWithChar(words[i], '.')) {
            // Check if there is a next word
            // This probably needs to be improved with machine learning
            if (i+1 < L) {
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

                    if (Match.isNumber(words[i+1])) {
                        if (Match.isCustomAbbreviation(words[i])) {
                            continue;
                        }
                    }
                }
                else {
                    // Skip ellipsis
                    if (String.endsWith(words[i], "..")) {
                        continue;
                    }

                    //// Skip abbreviations
                    // Short words + dot or a dot after each letter
                    if (Match.isDottedAbbreviation(words[i])) {
                        continue;
                    }

                    if (Match.isNameAbbreviation(wordCount, words.slice(i, 5))) {
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

    if (current.length) {
        sentences.push(current);
    }

    /** After processing */
    var result   = [];
    var sentence = "";

    // Clear "empty" sentences
    sentences = sentences.filter(function(s) {
        return s.length > 0;
    });

    for (var i=0; i < sentences.length; i++) {
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

},{"./Match":1,"./String":2,"sanitize-html":3}]},{},[4])(4)
});