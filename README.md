# Sentence Boundary Detection (SBD)

Simple sentence detection (i.e working ~95% of the time):

* Split a text based on period, question- and exclamation marks.
    * Skips abbreviations
    * Skips numbers, currency
    * Skips urls, email address, phone nr.

## Future work

Currently, `sbd` fails to recognize sentences ending in an abbreviation, for example "The president lives in Washington, D.C." and I do not really see a viable option other than using a real classifier with proper training.

## Installation

Use [npm](http://npmjs.org):

    $ npm install sbd


## How to

```javascript
var tokenizer = require('sbd');

var text = "In I.C.T we have multiple challenges!
This is a text of three sentences. Skip Mr. Money €10.00 right.";

var sentences = tokenizer.sentences(text);

// [
//  'In I.C.T we have multiple challenges!',
//  'This is a text of three sentences.',
//  'Skip Mr. Money €10.00 right.'
// ]
```

