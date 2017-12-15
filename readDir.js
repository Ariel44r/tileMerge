const fs = require('fs'),
      readLine = require('readline'),
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tileMerge > '
      });

exports.readDir = function(pathTest) {
    fs.readdir(pathTest, (err, files) => {
      if (files != null){
        console.log(files);
        rl.prompt();
      } else {
        console.log(err);
        rl.prompt();
      }
    });
}