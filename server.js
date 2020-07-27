const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.PASSWORD
);

mongoose.connect(database, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
}).then(connection => {
  console.log(connection.connections);
  console.log('Database connection successfull !!!');
})
const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});
