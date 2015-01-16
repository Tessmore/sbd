
exports.isCapitalized = function(str) {
    var firstChar = str.charAt(0);
    var rest      = str.substring(1);

    return firstChar === firstChar.toUpperCase() &&
           rest      === rest.toLowerCase();
}

// Start with opening quotes or capitalized letter
exports.isSentenceStarter = function(str) {
    var t = /``|"|'/.test(str.substring(0,2)) ||
           this.isCapitalized(str);

    return t;
}

exports.isCommonAbbreviation = function(str) {
    var abbreviations = [
        "ie",
        "eg",
        "Fig",

        "Mrs", "Mr", "Ms",
        "Prof", "Dr",
        "Gen", "Rep", "Sen",
        "St",

        "Sr", "Jr",
        "PhD", "MD", "BA", "MA",
        "BSc", "MSc",

        "Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Sept","Oct","Nov","Dec",
        "Sun","Mon","Tu","Tue","Tues","Wed","Th","Thu","Thur","Thurs","Fri","Sat"
    ];

    return ~abbreviations.indexOf(str.replace(/\W+/g, ''));
}

exports.isDottedAbbreviation = function(word) {
    var matches = word.replace(/[\(\)\[\]\{\}]/g, '').match(/(.\.)*/);

    return matches && matches[0].length > 0;
}

// Short word with "capital letter" and ends with "dot"
// example Sen. or Gov.
exports.isCustomAbbreviation = function(str) {
    if (str.length > 4)
        return false;

    return str[0] === str[0].toUpperCase();
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

    if ((i = word.indexOf(".")) > -1 || (i = word.indexOf("!")) > -1 || (i = word.indexOf("?")) > -1) {
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
