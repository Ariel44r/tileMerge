const fs = require('fs'),
      path = require('./path.js'),
      sqlite = require('./sqlite.js'),
      readLine = require('readline'),
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tileMerge > '
      });

exports.readDir = function(pathDir) {
  var percentage = 0;
  path.mainPath(pathDir);//root_dir
  readPathDir(pathDir, (lotes) => {
    percentage = percentage + (1/lotes.length);    
    lotes.forEach(lote => {
      const pathToLote = pathDir + '/' + lote;//lote
      if((fs.lstatSync(pathToLote).isDirectory()) && (lote.charAt(0) != '.')) {
        readPathDir(pathToLote,(cuadrants) => {
          cuadrants.forEach(cuadrant => {
            const pathToCuadrant = pathToLote + '/' + cuadrant;//cuadrant
            if((fs.lstatSync(pathToCuadrant).isDirectory()) && (cuadrant.charAt(0) != '.')) {
              readPathDir(pathToCuadrant,(levels_zoom) => {
                levels_zoom.forEach(level_zoom => {
                  const pathToLevel_zoom = pathToCuadrant + '/' + level_zoom; //level_zoom
                  if((fs.lstatSync(pathToLevel_zoom).isDirectory()) && (level_zoom.charAt(0) != '.')) {
                    readPathDir(pathToLevel_zoom,(dirsBF) => {
                      dirsBF.forEach(dirBF => {
                        const pathToDirBF = pathToLevel_zoom + '/' + dirBF; //directory before Files.png
                        if(fs.lstatSync(pathToDirBF).isDirectory()) {
                          readPathDir(pathToDirBF, (pngs) => {
                            pngs.forEach(png => {
                              const pathToPNG = pathToDirBF + '/' + png;
                              const fullPathObj = {
                                root_dir: pathDir,
                                lote: path.basename(pathToLote),
                                cuadrant: path.basename(pathToCuadrant),
                                level_zoom: path.basename(pathToLevel_zoom),
                                dir1: path.basename(pathToDirBF),
                                fileName: path.basename(pathToPNG)
                              }
                              //call SQLite method
                              sqlite.insertRecord(fullPathObj);
                            });
                          });
                        }
                      });
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
    rl.prompt();
  });
}

function readPathDir(pathToRead,callback){
  fs.readdir(pathToRead, (err, files) => {
    if (files != null){
      callback(files);
    } else {
      console.log(err);
      rl.prompt();
    }
  });
}