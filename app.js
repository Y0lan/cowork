const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const spaces = JSON.parse(fs.readFileSync(`${__dirname}/data/spaces.json`));
app.get('/api/v1/spaces', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      spaces,
    },
  });
});

app.get('/api/v1/spaces/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > spaces.length) {
    res.status(404).send({
      status: 'fail',
      message: 'invalid id',
    });
  }
  const space = spaces.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      space,
    },
  });
  res.send();
});

app.post('/api/v1/spaces/', (req, res) => {
  const space = req.body;
  space.id = spaces[spaces.length - 1].id + 1;
  spaces.push(space);
  fs.writeFile(
    `${__dirname}/data/spaces.json`,
    JSON.stringify(spaces),
    (err) => {
      if (err)
        res.status(500).json({
          status: 'error',
          data: 'none',
        });
      res.status(201).json({
        status: 'success',
        data: {
          space,
        },
      });
    }
  );
});

app.patch('/api/v1/spaces/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > spaces.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  spaces[id] = req.params.body;
  const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: {
      space,
    },
  });
});

app.delete('/api/v1/spaces/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > spaces.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  spaces[id] = req.params.body;
  const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: null
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});
