const express = require('express');
const app = express();
const userRoute = require('./users.js');
const animalRoute = require('./animals');
const categoryRoute = require('./categories');
const imageRoute = require('./images');
const videoRoute = require('./videos');
const unitRoute = require('./units');//units of feed (kg,gm...)
const designationRoute = require('./designations');//designations of employee
const farmRoute = require('./farms');//designations of employee
const feedRoute = require('./feeds');//feeds
const feedAnimalRoute = require('./feedanimals');//feed of animal

const stateRoute = require('./states');
const cityRoute = require('./cities');
const zipcodeRoute = require('./zipcodes');

app.use('/user', userRoute);
app.use('/animal', animalRoute);
app.use('/category', categoryRoute);
app.use('/video', videoRoute);
app.use('/image', imageRoute);
app.use('/unit', unitRoute);
app.use('/designation', designationRoute);
app.use('/farm', farmRoute);
app.use('/feed', feedRoute);
app.use('/feedanimal', feedAnimalRoute);


app.use('/state', stateRoute);
app.use('/city', cityRoute);
app.use('/zipcode', zipcodeRoute);

module.exports = app;