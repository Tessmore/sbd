
module.exports = function sanitizeHtml(text, opts) {
  // Strip HTML from Text using browser HTML parser
  if ((typeof text == 'string' || text instanceof String) && typeof document !== "undefined") {
    var $div = document.createElement("DIV");
    $div.innerHTML = text;
    text = ($div.textContent || '').trim();
  }
  //DOM Object
  else if (typeof text === 'object' && text.textContent) {
    text = (text.textContent || '').trim();
  }

  return text;
};
