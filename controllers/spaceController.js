const fs = require('fs');
const spaces = JSON.parse(fs.readFileSync(`${__dirname}/../data/spaces.json`));

exports.checkID = (req, res, next, val) => {
  const id = val * 1;
  if (id >= spaces.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 'fail',
        message: 'wrong data sent'
      })
  }
  next();
};

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
  console.log(spaces);
  fs.writeFile(
    `${__dirname}/../data/spaces.json`,
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
  spaces[id] = req.params.body;
  const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: null,
  });
};
