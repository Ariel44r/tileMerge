var sqlite3 = require('sqlite3').verbose(),
     db = new sqlite3.Database('./database.db'),
    randomString = require('randomstring'); 

exports.query = function(callback){
    //Perform SELECT Operation
    db.all("SELECT * from paths", function(err,rows){
        //rows contain values while errors, well you can figure out.
        callback(rows);
    });
}


exports.randomStringVal = function(callback) {
    callback(randomString.generate({
        length: '8',
        charset: 'numeric'
    }));
}