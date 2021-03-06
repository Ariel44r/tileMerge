const readLine = require('readline'),
      pathVar = require('./path.js'),
      readDir = require('./readDir.js'),
      overlay = require('./overlay.js'),
      sqlite = require('./sqlite.js'),
      path = require('./path.js'),
      fs = require('fs');
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tileMerge > '
      });

var path1 = pathVar.getPath('tiles.1') + '/tiles1/0/1669.png';
var path2 = pathVar.getPath('tiles.1') + '/tiles2/0/1669.png';
//var path1 = '/Users/aramirez/Desktop/rootDir/lote4/11020447/16/14563/28953.png';
//var path2 = '/Users/aramirez/Desktop/rootDir/lote4/11020448/16/14563/28953.png';
sqlite.createDBandTable();

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'sqlite':
      sqliteF();
      break;
    case 'query repeat':
      sqliteQueryR();
      break;
    case 'path':
      pathF();
      break;
    case 'repeat':
      repeatF();
      break;
    case 'merget':
      overlayF();
      break;
    case 'merge':
      getRepeatPathsF();
      break;
    case 'get repeat':
      getRepeatPathsAfterOverlay();
      break;
    case 'clear':
      clearScreen();
      break;
    case 'exit':
      console.log('Have a nice Day!');
      process.exit(0);
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

function sqliteF() {
  var query = 'select * from pathTiles;';  
  sqlite.query(query, (resp) => {
    //console.log(resp);
    resp.forEach(row => {
      console.log(path.getFullPath(row));
    });
    rl.prompt();
  });
}

function sqliteQueryR(){
  var queryR = 'select *, count(*) from pathTiles group by file_name, level_zoom, dir_1 having count(*) > 1;';
  sqlite.query(queryR, (resp) => {
    sqlite.updateRecord(resp);
    /*resp.forEach(row => {
      //console.log(row);
      console.log(path.getFullPath(row));
    });*/
    console.log('\n\n' + resp.length + '\n\n')
    rl.prompt();
  });
}

function getRepeatPathsAfterOverlay() {
  var query = 'select * from pathTiles where repeat_flag=1;';  
  sqlite.query(query, (resp) => {
    console.log(resp.length);
    resp.forEach(row => {
      console.log(path.getFullPath(row));
    });
    rl.prompt();
  });
}

function pathF() {
  rl.question('Please enter the root directory path: ', (rootPath) => {
    clearScreen();
    readDir.readDir(rootPath);
    rl.prompt();
  });
}

function overlayF() {
  console.log('merging images!');
  overlay.overlayTest(path1, path2, (oldPath) => {
    if(oldPath != false){
      unlinkFile(path1);
      unlinkFile(path2);
      fs.rename(oldPath,path1, (err) => {
        if(err){
          console.log(err);
        }
      });
    }
  });
}

function repeatF() {
  const queries = [
    "select distinct lote from pathTiles;",
    "select distinct level_zoom from pathTiles;",
    "select distinct dir_1 from pathTiles;"
  ];
  var rowsSQLite = {
    lote: [],
    level_zoom: [],
    dir_1: []
  };
  var counter = 0;
  sqlite.query(queries[0], (rows) => {
    rowsSQLite.lote = rows;
  });
  sqlite.query(queries[1], (rows) => {
    rowsSQLite.level_zoom = rows;
  });
  sqlite.query(queries[2], (rows) => {
    rowsSQLite.dir_1 = rows;
    callRepeatSQLite(rowsSQLite);
  });
}

function callRepeatSQLite(rowsSQLite){
  console.log('Start find repeat tiles ...');
  for(var x=0;x<rowsSQLite.lote.length;x++){
    //console.log(rowsSQLite.lote[x].lote);
    for(var y=0;y<rowsSQLite.level_zoom.length;y++){
      //console.log(rowsSQLite.level_zoom[y].level_zoom);
      for(var z=0;z<rowsSQLite.dir_1.length;z++){
        //console.log(rowsSQLite.dir_1[z].dir_1);
        const queryRepeat = `select *, rowid from pathTiles where lote='${rowsSQLite.lote[x].lote}' and level_zoom='${rowsSQLite.level_zoom[y].level_zoom}' and dir_1='${rowsSQLite.dir_1[z].dir_1}';`;
        sqlite.selectRepeatRows(queryRepeat);
      }
    }
  }
}

function getRepeatPathsF(){
  const queryRepeatPaths = 'select * from pathTiles where repeat_flag=1;';
  sqlite.query(queryRepeatPaths, (rowsRepeat) => {
    rowsRepeat.forEach(row => {
      rowsRepeat.forEach(row2 => {
        if(row.repeat == row2.repeat && row.cuadrant != row2.cuadrant && row.level_zoom == row2.level_zoom){
          overlay.overlay(path.getFullPath(row), path.getFullPath(row2), (oldPath) => {
            if(oldPath != false){
              var pathArray = [oldPath,path.getFullPath(row), path.getFullPath(row2)];
              renameFile(pathArray, (isMerged) => {
                if(isMerged){
                  unlinkFile(pathArray[0]);
                }
              });
            }
          });
        }
      });
    });
    rl.prompt();
  });
}

function unlinkFile(unlinkPath){
  if(fs.existsSync(unlinkPath)){
    fs.unlinkSync(unlinkPath);
  } else {
    console.log(`\nunlinkFile: '${unlinkPath}' not exists!\n`);
  }
}

function renameFile(pathArray, callback){
  unlinkFile(pathArray[1]);
  //unlinkFile(pathArray[2]);
  fs.readFile(pathArray[0], (err, data) => {
    if(err){throw err}
    if(data){
      fs.writeFile(pathArray[1],data, (err) => {
        console.log('writeFile: ' + pathArray[1]);
        callback(true);
      });
    }
  });
}

/*function renameFile(pathArray){
  if(fs.existsSync(pathArray[0])){
    if(!fs.existsSync(pathArray[1])){
      unlinkFile(pathArray[2]);
      console.log(`RENAME ${pathArray[1]}`);                   
      fs.createReadStream(pathArray[0]).pipe(fs.createWriteStream(pathArray[1])); //pipeunlink more items
    } else{
      unlinkFile(pathArray[1]);
      renameFile(pathArray[0],pathArray[1]);
    }
  }
}*/

function clearScreen() {
  console.clear();
}
