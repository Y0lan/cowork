const express = require('express');
const mongoose = require('mongoose');
const Space = require('./../models/spaceModel');
const Review = require('./../models/reviewModel');
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

const deleteAllSpaces = async () => {
  try {
    await Space.deleteMany();
    console.log('successfully deleted');
    return true;
  } catch (err) {
    console.log(err.message);
  }
};
const deleteAllReviews = async () => {
  try {
    await Review.deleteMany();
    console.log('successfully deleted');
    return true;
  } catch (err) {
    console.log(err.message);
  }
};
const spaces = JSON.parse(fs.readFileSync(`${__dirname}/spaces.json`, 'utf-8'));

const importSpaces = async () => {
  try {
    const docs = await Space.create(spaces);
    console.log('successfully sent');
  } catch (err) {
    console.log(err.message);
  }
};

if(process.argv[2] === '-is') importSpaces();
if(process.argv[2] === '-ds') deleteAllSpaces();
if(process.argv[2] === '-dr') deleteAllReviews();
