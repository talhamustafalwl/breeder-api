const express = require('express');
const app = express();
const userRoute = require('./users.js');
const animalRoute = require('./animals');
const categoryRoute = require('./categories');

app.use('/user', userRoute);
app.use('/animal', animalRoute);
app.use('/category', categoryRoute);

module.exports = app;