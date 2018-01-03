const sharp = require('sharp'),
      fs = require('fs'),
      rl = require('./readLine.js');

exports.overlay = function(path1, path2, out) {
    fs.exists(path1, (exists) => {
      if (exists == true) {
        fs.exists(path2, (exists) => {
            if (exists == true) {
              sharp(path1)
              .overlayWith(path2, { gravity: sharp.gravity.southeast } )
              .toFile(`testOverlays/${out}.png`)
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