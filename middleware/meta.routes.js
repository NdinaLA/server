const express = require('express');
const app = express();
const dataRouter = require('./data.routes');

app.use('/data', dataRouter);

module.exports = app;
