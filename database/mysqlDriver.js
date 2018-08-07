const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'diarylife',
    port:'3306'
});

exports.exe = function(sql, sqlParams, callback) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
        	if(err){
        		if(connection){
        			connection.release();
        		}
        		return reject(err);
        	}

            connection.query(sql,sqlParams, function(error, results, fields) {
                if(error){
                	if(connection){
                		connection.release();
                	}
                	return reject(error);
                }
                resolve(results);
                connection.release();
            });
        });
    });
}

