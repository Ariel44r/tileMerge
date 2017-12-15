const sharp = require('sharp'),
      fs = require('fs'),
      readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'tileMerge > '
});

exports.overlay = function(path1, path2) {
    fs.exists(path1, (exists) => {
      if (exists == true) {
        fs.exists(path2, (exists) => {
            if (exists == true) {
              sharp(path1)
              .overlayWith(path2, { gravity: sharp.gravity.southeast } )
              .toFile('output2.png')
            } else {
              console.log(`File '${path2}' not exists`);
              rl.prompt();
            }
        });
      } else {
        console.log(`File '${path1}' not exists`);
        rl.prompt();
      }
    });
}