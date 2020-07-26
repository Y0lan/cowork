const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from the server!');
});

app.post('/', (req, res) => {
  res.send('FUCK');
});

const port = 3000;
app.listen(port, () => {
  console.log('HELLO');
});
