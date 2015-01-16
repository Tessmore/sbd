Sentence Boundary Detection (SBD)
==================

Split text into sentences with a `vanilla` rule based approach (i.e working ~95% of the time).


* Split a text based on period, question- and exclamation marks.
    * Skips (most) abbreviations (Mr., Mrs., PhD.)
    * Skips numbers/currency
    * Skips urls, websites, email addresses, phone nr.
    * Counts ellipsis and ?! as single punctuation

## Installation

Use [npm](http://npmjs.org):

    $ npm install sbd


## How to

```javascript
var tokenizer = require('sbd');

var text = "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.";
var sentences = tokenizer.sentences(text);

// [
//  'On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S.',
//  'Millions attended the Inauguration.',
// ]


var text = "Got any problems? Open an issue on github.com!";
var sentences = tokenizer.sentences(text);

// [
//  'Got any problems?',
//  'Open an issue on github.com!',
// ]

// Sometimes newlines are important. Newlines can be treated as sentence endings

file.txt
"""
Title of project: Hello World
Author: Kenny

May, 2012

Lorem ipsum dolor sit amet. Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco (laboris nisi?) ut aliquip ex ea commodo consequat.
"""

var sentences = tokenizer.sentences(textFromFile, true);

// [
//  'Title of project: Hello World',
//  'Author: Kenny',
//  'May, 2012',
//  'Lorem ipsum dolor sit amet.',
//  'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//  'Ut enim ad minim veniam, quis nostrud exercitation ullamco (laboris nisi?) ut aliquip ex ea commodo consequat.'
// ]
```

## Notes

I cannot find a "test data set" to rate the performance, but I can imagine it needs a trained data set to help with difficult edge cases. For example, sentences that do end with an abbreviation.

