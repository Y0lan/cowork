// Adding $ in front of get, gt, lte, lt in the query for querying in a more human way
exports.advancedFiltering = (query) => {
  return JSON.stringify(query).replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
};
