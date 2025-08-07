// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your database username
    password: '', // your database password
    database: 'helpdesk_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

module.exports = db;
