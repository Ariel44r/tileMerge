const readLine = require('readline'),
      readDir = require('./readDir.js'),
      overlay = require('./overlay.js'),
      path = require('./path.js'),
      sqlite = require('./sqlite.js'),
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'tileMerge > '
      });

var path1 = '/home/ariel/Documents/Development/WebDev/tiles/tiles1/0/1669.png';
var path2 = '/home/ariel/Documents/Development/WebDev/tiles/tiles2/0/1669.png';

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'sqlite':
      sqliteF();
      break;
    case 'path':
      rl.question('Please enter the root path: ', (rootPath) => {
        clearScreen();
        path.mainPath(rootPath);
        readDir.readDir(rootPath);
        rl.prompt();
      });
      break;
    case 'merge':
      console.log('merging images!');
      overlay.overlay(path1, path2);
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

function clearScreen() {
  console.clear();
}

function sqliteF() {
  sqlite.query((resp) => {
    console.log(resp);
    rl.prompt();
  });
}