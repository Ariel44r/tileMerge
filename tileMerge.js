const sharp = require('sharp'),
      fs = require('fs'),
      readLine = require('readline'),
      path = require('path');;

var path1 = 'tiles/f1/1668.png';
var path2 = 'tiles/f2/1668.png';
var mainPath;

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'tileMerge > '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'merge':
      console.log('merging images!');
      overlay(path1, path2);
      break;
    case 'Path':
      rl.question('Please enter the root path: ', (rootPath) => {
        console.log(`Starting find in the '${rootPath}' path.`);
        //call method to start find with rootPath
        mainPath = rootPath;
        readDir(rootPath);
        rl.prompt();
      });
      break;
    case 'readdir':
      readDir();
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

function readDir(pathTest) {
  fs.readdir(pathTest, (err, files) => {
    if (files != null) {
      files.forEach(file => {
        console.log(getPath(file));
      });
      rl.prompt();
    } else {
      console.log(err);
      rl.prompt();
    }
  });
}

function overlay(path1, path2) {
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

function getPath(fileName) {
  return(mainPath + path.basename(fileName));
}

function clearScreen() {
  console.log('\033[2J');
}