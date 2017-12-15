var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');
 

exports.query = function(callback){
    //Perform SELECT Operation
    db.all("SELECT * from paths", function(err,rows){
        //rows contain values while errors, well you can figure out.
        callback(rows);
    });
}
