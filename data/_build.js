
var abbreviations = require('../data/abbr').abbreviations;

function too_short(str) {
    return str.length > 1;
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.LOWER = function() {
  var i = this.length;
  while (--i >= 0) {
    this[i] = this[i].toLowerCase();
  }

  return this;
};

console.log(abbreviations.LOWER().filter(unique).filter(too_short).sort());