const { values } = require('lodash');
const mysql = require('mysql2');

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
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tms',
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,
    connectTimeout: 10000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

exports.query = (sql, value) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

