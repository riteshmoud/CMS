const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'admin@123',
    database: 'cms'
})

const db = pool.promise()

module.exports = {db}