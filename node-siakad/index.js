//declare dependencies and db connection
const session = require('express-session'),
  bodyParser = require('body-parser'),
  express = require('express'),
  db = require('./mysql'),
  app = express(),
  port = 1992;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//render & server-works
app.post('/auth', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    db.query('SELECT * FROM data WHERE email_pemesan = ? AND password = ?', [email, password], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        req.session.email = email;
        res.redirect('/home');
      } else {
        res.redirect('/wrong');
      }
      res.end();
    });
  }
});

app.get('/home', (req, res) => {
  var {
    data_login
  } = req.params;
  var {
    nama_pemesan
  } = req.params;
  db.query('SELECT * FROM data, pesanan ORDER BY id_user LIMIT 1', [data_login, nama_pemesan], (err, rows) => {
    data_login = req.session;
    nama_pemesan = req.session;
    if (err) throw err;
    if (rows.length > 0) {
      datalogin = rows[0];
      pemesan = rows[0];
    } else {
      datalogin = null;
      pemesan = null;
    }
    res.render('../views/welcome.ejs', {
      datalogin: datalogin,
      pemesan: pemesan
    });
  });
});

app.post('/authlab', (req, res) => {
  var datas = {
    nama: req.body.nama,
    kelas: req.body.kelas,
    email: req.body.email,
    mapel: req.body.mapel,
    guru: req.body.guru,
    tgl: req.body.tgl,
    jambelajar: req.body.jambelajar
  };

  db.query('INSERT INTO pesanan SET ?', datas, (err, results, fields) => {
    if (!err) {
      console.log('Hasil berhasil data: ', results);
      res.redirect('/thanks');
    } else if (err) {
      console.log('Ada error, yurod', err);
      res.json({
        status: false,
        code: 400,
        failed: 'Ada error, yurod'
      });
    }
  });
});

app.get('/thanks', (req, res) => {
  var {
    nama_pesan
  } = req.params;
  db.query('SELECT nama FROM pesanan ORDER BY id_pesan DESC LIMIT 0,1', [nama_pesan], (err, rows) => {
    if (err) throw err;
    if (rows.length > 0) {
      users = rows[0];
    } else {
      users = null;
    }
    res.render('../views/semualab/lab-pesan/makasi/makasi.ejs', {
      users: users
    });
  });
});

app.post('/logout', (req, res) => {
  res.redirect('/');
  res.end();
});

app.get('/', (req, res) => {
  res.render('login.ejs');
});

app.get('/lab-pesan', (req, res) => {
  res.render('labs.ejs');
});

app.get('/lab1', (req, res) => {
  res.render('semualab/lab-1.ejs');
});

app.get('/pesan', (req, res) => {
  res.render('semualab/lab-pesan/laboratorium-siakad.ejs');
});

app.get('/backtologin', (req, res) => {
  res.redirect('/');
});

app.get('*', (req, res) => {
  res.write('404 Not Found')
});

//deklarasi port server
app.listen(port, () => {
  console.log(`Server di localhost:${port}`);
});