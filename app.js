const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan')
// MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'))

const spaces = JSON.parse(fs.readFileSync(`${__dirname}/data/spaces.json`));

// ROUTE HANDLERS
const getAllSpaces = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      spaces,
    },
  });
};

const getOneSpace = (req, res) => {
  const id = req.params.id * 1;
  if (id >= spaces.length) {
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
};

const createOneSpace = (req, res) => {
  const space = req.body;
  space.id = spaces[spaces.length - 1].id + 1;
  spaces.push(space);
  fs.writeFile(
    `${__dirname}/data/spaces.json`,
    JSON.stringify(spaces),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          space,
        },
      });
    }
  );
};

const modifyOneSpace = (req, res) => {
  const id = req.params.id * 1;
  if (id >= spaces.length) {
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
      space: 'modified space here!',
    },
  });
};

const deleteOneSpace = (req, res) => {
  const id = req.params.id * 1;
  if (id >= spaces.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  spaces[id] = req.params.body;
  const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: null,
  });
};

// ROUTE

app.route('/api/v1/spaces').get(getAllSpaces).post(createOneSpace);
app
  .route('/api/v1/spaces/:id')
  .get(getOneSpace)
  .delete(deleteOneSpace)
  .patch(modifyOneSpace);

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});
