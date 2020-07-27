const Space = require('./../models/spaceModel');

exports.getAllSpaces = (req, res) => {
  res.status(200).json({
    status: 'success',
    //results: spaces.length,
    //data: {
    // spaces,
    //},
  });
};

exports.getOneSpace = (req, res) => {
  const id = req.params.id * 1;
  // const space = spaces.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    //  data: {
    //     space,
    //   },
  });
  res.send();
};

exports.createOneSpace = async (req, res) => {
  const newSpace = await Space.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      space: newSpace,
    },
  });
};

exports.modifyOneSpace = (req, res) => {
  const id = req.params.id * 1;
  //spaces[id] = req.params.body;
  //const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: {
      space: 'modified space here!',
    },
  });
};

exports.deleteOneSpace = (req, res) => {
  const id = req.params.id * 1;
  //spaces[id] = req.params.body;
  //const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: null,
  });
};
