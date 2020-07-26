const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
// MIDDLEWARE
app.use(express.json());
app.use(morgan('dev'));

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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

const getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

const deleteOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

const modifyOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!',
  });
};

// ROUTE

const spacesRouter = express.Router();
const usersRouter = express.Router();

spacesRouter.route('/').get(getAllSpaces).post(createOneSpace);
spacesRouter
  .route('/:id')
  .get(getOneSpace)
  .delete(deleteOneSpace)
  .patch(modifyOneSpace);

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter
  .route('/:id')
  .get(getOneUser)
  .delete(deleteOneUser)
  .patch(modifyOneUser);

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/spaces', spacesRouter)

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});
