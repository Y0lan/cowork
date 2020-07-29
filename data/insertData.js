const express = require('express');
const mongoose = require('mongoose');
const Space = require('../models/spaceModel');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => console.log('Database connection successfull !'));

const data = fs.readFile('./spaces.json', (err, data) => {
  if (err) throw err;
});
