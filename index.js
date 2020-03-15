// dotenv is for encryption of sensitive data
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const router = require('./middleware/meta.routes');
const port = 5005;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PASS,
  database: 'ndina'
});

// Connect
db.connect(err => {
  if (err) {
    throw err;
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
