build:
	browserify lib/tokenizer.js --standalone tokenizer > dist/sbd.js
	uglifyjs dist/sbd.js > dist/sbd.min.js
