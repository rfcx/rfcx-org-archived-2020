var striptags = require('striptags');

exports.stripString = function(str) {
  return striptags(str);
};

// Go through all strings and nested objects with strings and strip html tags
exports.stringObject = function(obj) {
  function iterate(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var item = obj[key],
            type = typeof(item);
        if (type == 'string') {
          obj[key] = striptags(item);
        }
        else if (type == 'object') {
          iterate(obj[key]);
        }
      }
    }
    return obj;
  }
  return iterate(obj);
};