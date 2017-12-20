var sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('./database.db'),
    path = require('./path.js'),
    fs = require('fs'),
    randomString = require('randomstring'); 

exports.createDBandTable = function(){
    const dbPath = '/home/ariel/Documents/Development/WebDev/TILEMERGE/tileMerge/database.db';
    if(fs.existsSync(dbPath)) {
      console.log('database.db was created before');
    } else {
      fs.openSync(dbPath, 'w');
      console.log('database.db is being created');
    }
    const createTableSQL = 'CREATE TABLE IF NOT EXISTS pathTiles (root_dir varchar(255) NOT NULL,lote varchar(255),cuadrant varchar(255),level_zoom varchar(255),dir_1 varchar(255),file_name varchar(255),repeat integer,repeat_flag integer);'
    db.run(createTableSQL);
}

exports.insertRecord = function(fullPathObj){
    const insertRecordQ = `insert into pathTiles values('${fullPathObj.root_dir}','${fullPathObj.lote}','${fullPathObj.cuadrant}','${fullPathObj.level_zoom}','${fullPathObj.dir1}','${fullPathObj.fileName}',0,0);`;
    db.run(insertRecordQ, (err, resp) => {
        console.log(`insertRecord ${fullPathObj.root_dir}/${fullPathObj.lote}/${fullPathObj.cuadrant}/${fullPathObj.level_zoom}/${fullPathObj.dir1}/${fullPathObj.fileName}`);
    });
}

exports.query = function(callback){
    //Perform SELECT Operation
    var query = 'select * from pathTiles';
    db.all(query, function(err,rows){
        //rows contain values while errors, well you can figure out.
        callback(rows);
    });
}

exports.randomStringVal = function(callback) {
    callback(randomString.generate({
        length: '16',
        charset: 'numeric'
    }));
}

function buildSQL(jsonArray){
    var sql = `insert into pathTiles values(`;
    var counter = 0;
    var sqlite = ``;
    jsonArray.forEach(element => {
        counter++;
        if (counter == jsonArray.length){
            sql = sql +`('${element.root_dir}','${element.lote}','${element.cuadrant}','${element.level_zoom}','${element.dir_1}','${element.file_name}'));`;
            return sql;
        } else{
            sqlite = sql + `('${element.root_dir}','${element.lote}','${element.cuadrant}','${element.level_zoom}','${element.dir_1}','${element.file_name}'),`;            
        }
    });
}