const fs = require('fs');
const spaces = JSON.parse(fs.readFileSync(`${__dirname}/../data/spaces.json`));
exports.getAllSpaces = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: spaces.length,
    data: {
      spaces,
    },
  });
};

exports.getOneSpace = (req, res) => {
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

exports.createOneSpace = (req, res) => {
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

exports.modifyOneSpace = (req, res) => {
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

exports.deleteOneSpace = (req, res) => {
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

