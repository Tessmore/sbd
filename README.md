# Sentence Boundary Detection (SBD)

Simple sentence detection:

* Split a text based on period, question- and exclamation marks.
    * Skips abbreviations
    * Skips numbers, currency
    * Skips urls, email address, phone nr.

## Installation

Use [npm](http://npmjs.org):

    $ npm install sbd


## How to

```javascript
var text = "In I.C.T we have multiple challenges! This is a text of three sentences. Skip Mr. Money €10.00 right.";
var sentences = tokenizer.sentences(text);

/** Gives

[
  'In I.C.T we have multiple challenges!',
  'This is a text of three sentences.',
  'Skip Mr. Money €10.00 right.'
]

*/

```

