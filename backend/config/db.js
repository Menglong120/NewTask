const { values } = require('lodash');
const mysql = require('mysql');

// const pool = mysql.createPool({
//     host: '192.168.69.83',
//     user: 'nsmtech',
//     password: 'NsmTech@2025',
//     database: 'tms',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tms',
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,
});

exports.query = (sql, value) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

