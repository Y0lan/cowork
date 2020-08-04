const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION ERROR!\n', error.name, error.message);
  console.error('Shutting down...');
  process.exit(1);
});

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => console.log('Database connection successfull !'));

const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});

process.on('unhandledRejection', (error) => {
  console.error('UNCHANDLED EXCEPTION ERROR!\n', error.name, error.message);
  console.error('Shutting down...');
  // Let all the async request finish before shutting down
  app.close(() => {
    // shutting down
    process.exit(1);
  });
});
