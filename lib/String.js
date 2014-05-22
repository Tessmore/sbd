
exports.ends_with_char = function ends_with_char(word, c) {
    if (c.length > 1) {
        return c.indexOf(word.slice(-1)) > -1;
    }

    return word.slice(-1) === c;
};

exports.ends_with = function ends_with(word, end) {
    return word.slice(word.length - end.length) === end;
};

exports.is_dotted_abbreviation = function is_dotted_abbreviation(word) {
    return word.match(/(.[.])*/)[0].length > 0;
}