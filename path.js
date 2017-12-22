const path = require('path'),
      fs = require('fs');
var mainPath,
    tmpPath;
exports.mainPath = function(_mainPath) {
    mainPath = _mainPath;
    tmpPath = _mainPath;
}

exports.getPath = function(fileName) {
    return(path.resolve(fileName));
}

exports.getMainPath = function() {
    return (mainPath);
}

exports.basename = function(fileName) {
    return (path.basename(fileName));
}