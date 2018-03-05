"use strict";

const tokenizer = require("../dist/sbd");
const previousTokenizer = require("./previous/sbd-1.0.12")

// https://en.wikipedia.org/wiki/Barack_Obama
const TEXTS = [
   `On Jan. 20, former Sen. Barack Obama became the
    44th President of the U.S. Millions attended the Inauguration.
    Obama was born in 1961 in Honolulu, Hawaii, two years after the
    territory was admitted to the Union as the 50th state. Raised largely in
    Hawaii, Obama also spent one year of his childhood in Washington State
    and four years in Indonesia. After graduating from Columbia University
    in New York City in 1983, he worked as a community organizer in Chicago.
    In 1988 Obama enrolled in Harvard Law School, where he was the first
    black president of the Harvard Law Review. After graduation, he became a
    civil rights attorney and professor, and taught constitutional law at
    the University of Chicago Law School from 1992 to 2004. Obama
    represented the 13th District for three terms in the Illinois Senate
    from 1997 to 2004, when he ran for the U.S. Senate. Obama received
    national attention in 2004 with his unexpected March primary win, his
    well-received July Democratic National Convention keynote address, and
    his landslide November election to the Senate. In 2008, Obama was
    nominated for president a year after his campaign began and after a
    close primary campaign against Hillary Clinton. He was elected over
    Republican John McCain and was inaugurated on January 20, 2009. Nine
    months later, Obama was named the 2009 Nobel Peace Prize laureate,
    accepting the award with the caveat that he felt there were others "far
    more deserving of this honor than I."`,

   `## Contents

    1   Early life and career
    1.1 Education
    1.2 Family and personal life
    1.3 Law career
    1.4 Legislative career

    In May 2002, Obama commissioned a poll to assess his prospects in a
    2004 U.S. Senate race. He created a campaign committee, began raising
    funds, and lined up political media consultant David Axelrod by August
    2002. Obama formally announced his candidacy in January 2003.[121]`
];


suite("Sentece detection (previous version v1.0.12)", function() {
    set("iterations", 20);


    bench("no-op comparison", function() {
        TEXTS.forEach(t => t.toLowerCase().trim());
    });

    bench("Sentence detection with default options", function() {
        const defaultOptions = {
            "newline_boundaries"  : false,
            "html_boundaries"     : false,
            "html_boundaries_tags": ["p","div","ul","ol"],
            "sanitize"            : false,
            "allowed_tags"        : false,
            "preserve_whitespace" : false,
            "abbreviations"       : null
        };

        TEXTS.forEach(function(t) {
            previousTokenizer.sentences(t, defaultOptions);
        });
    });

    bench("Sentence detection with newline boundaries", function() {
        const options = {
            "newline_boundaries": true
        };

        TEXTS.forEach(function(t) {
            previousTokenizer.sentences(t, options);
        });
    });

    bench("Sentence detection with html boundaries", function() {
        const options = {
            "html_boundaries": true
        };

        TEXTS.forEach(function(t) {
            previousTokenizer.sentences(t, options);
        });
    });

    bench("Sentence detection with preserve_whitespace", function() {
        const options = {
            "preserve_whitespace": true
        };

        TEXTS.forEach(function(t) {
            previousTokenizer.sentences(t, options);
        });
    });
});


suite("Sentece detection", function() {
    set("iterations", 20);


    bench("no-op comparison", function() {
        TEXTS.forEach(t => t.toLowerCase().trim());
    });

    bench("Sentence detection with default options", function() {
        const defaultOptions = {
            "newline_boundaries"  : false,
            "html_boundaries"     : false,
            "html_boundaries_tags": ["p","div","ul","ol"],
            "sanitize"            : false,
            "allowed_tags"        : false,
            "preserve_whitespace" : false,
            "abbreviations"       : null
        };

        TEXTS.forEach(function(t) {
            tokenizer.sentences(t, defaultOptions);
        });
    });

    bench("Sentence detection with newline boundaries", function() {
        const options = {
            "newline_boundaries": true
        };

        TEXTS.forEach(function(t) {
            tokenizer.sentences(t, options);
        });
    });

    bench("Sentence detection with html boundaries", function() {
        const options = {
            "html_boundaries": true
        };

        TEXTS.forEach(function(t) {
            tokenizer.sentences(t, options);
        });
    });

    bench("Sentence detection with preserve_whitespace", function() {
        const options = {
            "preserve_whitespace": true
        };

        TEXTS.forEach(function(t) {
            tokenizer.sentences(t, options);
        });
    });
});