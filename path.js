const path = require('path'),
      fs = require('fs');
var mainPath;
exports.mainPath = function(_mainPath) {
    mainPath = _mainPath;
}

exports.getPath = function(fileName) {
    return(path.basename(fileName));
}