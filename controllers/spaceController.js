const Space = require('./../models/spaceModel');

exports.getAllSpaces = async (req, res) => {
  const allSpaces = await Space.find({})
  try {
    res.status(200).json({
      status: 'success',
      results: allSpaces.length,
      data: {
       spaces: allSpaces
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    })
  }
};

exports.getOneSpace = async (req, res) => {
  try {
    const id = req.params.id;
    const spaceRequested = await Space.findById(id)
    res.status(200).json({
      status: 'success',
        data: {
           space : spaceRequested,
         },
    });
    res.send();
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    })
  }

};

exports.createOneSpace = async (req, res) => {
  try {
    const newSpace = await Space.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        space: newSpace,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.modifyOneSpace = async (req, res) => {
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

exports.deleteOneSpace = async (req, res) => {
  const id = req.params.id * 1;
  //spaces[id] = req.params.body;
  //const space = spaces[id];
  res.status(201).json({
    status: 'success',
    data: null,
  });
};
