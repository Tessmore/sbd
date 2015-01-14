module.exports = function sanitizeHtml(text, opts) {

    if (typeof text == 'string' || text instanceof String) {  // Strip HTML from Text using browser HTML parser
      var $div = document.createElement("DIV");
      $div.innerHTML = text;
      text =  ($div.textContent || '').trim();
    } else if (typeof text === 'object' && text.textContent) { //DOM Object
      text = (text.textContent || '').trim();
    }

    return text;

};
