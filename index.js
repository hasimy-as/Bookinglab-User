//import dependencies & settings
const express = require('express'),
    session = require('express-session'),
    db = require('./mysql.js'),
    // path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 5000;

app.set('view engine', 'ejs');
app.set(express.static('public'));
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//rendernya
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/authlogin', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const sql = 'SELECT * FROM user WHERE email_user = ? AND password = ?';
    if (email && password) {
        db.query(sql, [email, password], function (err, rows) {
            if (err) throw err;
            else if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/home');
            } else {
                res.write('Kredensial anda salah!');
            }
            res.end();
        });
    }
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('home');
    } else {
        res.redirect('/pelanggaran');
    }
    res.end();
});

app.get('/profil', (req, res) => {
    res.render('profil');
});

app.get('/lab', (req, res) => {
    res.render('laboratorium');
});

app.get('/jadwal', (req, res) => {
    res.render('jadwal');
});

app.get('/logout', (req, res) => {
    if (req.session.loggedin) {
        req.session.loggedin = false;
        res.redirect('/');
    }
    res.end();
});

app.get('/pelanggaran', (req, res) => {
    res.render('logindulu');
});

app.get('*', (req, res) => {
    res.render('404');
});

//declare port
app.listen(port, () => {
    console.log(`App listen in localhost:${port}`);
});