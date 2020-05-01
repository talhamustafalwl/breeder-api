const express = require('express');
const app = express();
const userRoute = require('./users.js');
const animalRoute = require('./animals');
const categoryRoute = require('./categories');
const imageRoute = require('./images');
const videoRoute = require('./videos');

app.use('/user', userRoute);
app.use('/animal', animalRoute);
app.use('/category', categoryRoute);
app.use('/image', imageRoute);
app.use('/video', videoRoute);

module.exports = app;