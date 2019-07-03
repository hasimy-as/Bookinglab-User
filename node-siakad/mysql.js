const mysql = require('mysql');

mysql.conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project'
});

mysql.conn.connect((err) => {
    if (err) {
        console.log('Koneksi gagal' + err);
    } else {
        console.log('Terkoneksi!');
    }
});

module.exports = mysql.conn;