// dotenv is for encryption of sensitive data
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const router = require('./middleware/meta.routes');
const port = 5005;
const bcrypt = require('bcrypt');
const fs = require('fs');
const userDb = './db/users.json';
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PASS,
  database: 'ndina',
});

// Connect
db.connect((err) => {
  if (err) {
    // throw err;
    // console.log(err.message);
  }
  console.log('MySql Connected');
});

// Create DB
app.get('/createdb', (request, response) => {
  let sql = 'CREATE DATABASE ndina';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    response.send('Database created...');
  });
});

// Create Table
app.get('/createpoststable', (request, response) => {
  let sql =
    'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    response.send('Posts table created...');
  });
});

app.get('/addpost3', (request, response) => {
  let post = { title: 'Post One', body: 'this is post number one' };
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    response.send('Post added...');
  });
});

// Select Posts
app.get('/getposts', (request, response) => {
  let sql = 'SELECT * FROM posts';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    response.send('Posts Fetched...');
  });
});

// Select Single Post
app.get('/getpost/:id', (request, response) => {
  let sql = `SELECT * FROM posts WHERE ${request.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    response.send('Post Fetched...');
  });
});

// Update Post
app.get('/updatepost/:id', (request, response) => {
  let newTitle = 'Updated Title';
  let sql = `UPDATE posts SET title='${newTitle}' WHERE ${request.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    response.send('Post Updated...');
  });
});

// Update Post
app.get('/deletepost/:id', (request, response) => {
  let sql = `DELETE FROM posts WHERE ${request.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    response.send('Post Deleted...');
  });
});

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log('Server is listening on port ', port);
});

//@route get /loadUser
//@desc get token for user
//@access private

app.get('/loadUser', auth, async (request, response) => {
  const { email } = request.user;
  const initdb = await fs.readFileSync(userDb);
  const user = await JSON.parse(initdb);

  try {
    const userData = await user.find((userEmail) => userEmail.email == email);
    delete userData.password;
    response.json(userData);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
});

//@route post /signUp
//@desc sign up user
//@access public

app.post('/signUp', async (request, response) => {
  const { name, email, password } = request.body;
  const initdb = await fs.readFileSync(userDb);
  const user = await JSON.parse(initdb);

  try {
    if (user.some((userData) => userData.email == email)) {
      return response.status(409).json({ msg: 'email already in use' });
    } else {
      const salt = await bcrypt.genSalt(2);
      const hashedpassword = await bcrypt.hash(password, salt);

      const newUserData = [
        ...user,
        { name: name, email: email, password: hashedpassword },
      ];

      const data = JSON.stringify(newUserData, null, 2);
      fs.writeFile(userDb, data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });

      //payload can be set to user id once made
      const payload = {
        user: {
          email: user.email,
        },
      };

      jwt.sign(
        payload,
        config.get('JWT_SECRET'),
        { expiresIn: 900 },
        (err, token) => {
          if (err) throw err;
          response.json({ token });
        }
      );
    }
  } catch (error) {
    console.error(error.message);
  }
});

//@route post /login
//@desc log in user and get token
//@access public

app.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const initdb = await fs.readFileSync(userDb);
    const parsed = await JSON.parse(initdb);
    const user = await parsed.find((user) => user.email === email);

    if (user == null) {
      return response.status(400).json({ msg: 'Cannot find user' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response.status(400).json({ msg: 'invalid credentials' });
    }

    //payload can be set to user id once made
    const payload = {
      user: {
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      config.get('JWT_SECRET'),
      { expiresIn: 900 },
      (err, token) => {
        if (err) throw err;
        response.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});
