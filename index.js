require('dotenv').config();
const express = require('express');
// const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const server = http.createServer(app);

server.listen(process.env.PORT, () =>
  console.log(`Server running on http://${process.env.DOMAIN}:${process.env.PORT}`)
);

module.exports = app;
