
// input: dot_index = position of a "." symbol
exports.is_number = function(str, dot_index) {
    if (dot_index) {
        str = str.slice(dot_index-1, dot_index+2);
    }

    return !isNaN(str);
};

// Phone number matching
// http://stackoverflow.com/a/123666/951517
exports.is_phone_nr = function(str) {
    return str.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
};

// Match urls / emails
// http://stackoverflow.com/a/3809435/951517
exports.is_url = function(str) {
    return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
};

// Starting a new sentence if beginning with capital letter
exports.is_concatenated = function(word) {
    var i = 0;

    if ((i = word.indexOf(".")) > -1 || (i = word.indexOf("!")) > -1 || (i = word.indexOf("?")) > -1) {
        var c = word.charAt(i + 1);

        if (c === c.toUpperCase()) {
            return [word.slice(0, i), word.slice(i+1)];
        }
    }

    return false;
};

exports.is_boundary_char = function(word) {
    return word === "." ||
           word === "!" ||
           word === "?";
};
