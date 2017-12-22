var sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('./database.db'),
    path = require('./path.js'),
    fs = require('fs'),
    randomString = require('randomstring'),
    rl = require('./readLine.js'); 

exports.createDBandTable = function(){
    const dbPath = path.getPath('') + '/database.db';
    if(fs.existsSync(dbPath)) {
      console.log('database.db was created before');
    } else {
      fs.openSync(dbPath, 'w');
      console.log('database.db is being created');
    }
    const createTableSQL = 'CREATE TABLE IF NOT EXISTS pathTiles (root_dir varchar(255) NOT NULL,lote varchar(255),cuadrant varchar(255),level_zoom varchar(255),dir_1 varchar(255),file_name varchar(255),repeat integer,repeat_flag integer);'
    db.run(createTableSQL);
}

exports.insertRecord = function(jsonArray){
    buildSQLinsert(jsonArray, (sqlInsertQ) => {
        //console.log(sqlInsertQ);
        //db.run(sqlInsertQ);  //synchronous form
        db.run(sqlInsertQ, (err, resp) => {         //asynch form
            console.log('insert all records success');
            rl.prompt();
        });      
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

function buildSQLinsert(jsonArray_, callback){
    var sql = `insert into pathTiles values`;
    var counter = 0;
    jsonArray_.forEach(element => {
        counter++;
        if (counter == jsonArray_.length){
            sql = sql +`('${element.root_dir}','${element.lote}','${element.cuadrant}','${element.level_zoom}','${element.dir_1}','${element.file_name}',0,0);`;
            //console.log(sql);
            callback(sql);
        } else{
            sql = sql + `('${element.root_dir}','${element.lote}','${element.cuadrant}','${element.level_zoom}','${element.dir_1}','${element.file_name}',0,0),`;            
        }
    });
}