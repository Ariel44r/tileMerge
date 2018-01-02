const readLine = require('readline'),
      pathVar = require('./path.js'),
      readDir = require('./readDir.js'),
      overlay = require('./overlay.js'),
      sqlite = require('./sqlite.js'),
      path = require('./path.js'),
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tileMerge > '
      });

var path1 = pathVar.getPath('tiles') + '/tiles1/0/1669.png';
var path2 = pathVar.getPath('tiles') + '/tiles2/0/1669.png';

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'sqlite':
      sqliteF();
      break;
    case 'path':
      pathF();
      break;
    case 'repeat':
      repeatF();
      break;
    case 'merge':
      overlayF();
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
  sqlite.createDBandTable();  
  sqlite.query((resp) => {
    console.log(resp);
    /*resp.forEach(row => {
      console.log(path.getFullPath(row));
    });*/
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
  overlay.overlay(path1, path2);
}

function repeatF() {
  const queryRepeat = "select *, rowid from pathTiles where lote='lote1' and level_zoom='16' and dir_1='12196';";
  sqlite.selectRepeatRows(queryRepeat);
}

function clearScreen() {
  console.clear();
}
