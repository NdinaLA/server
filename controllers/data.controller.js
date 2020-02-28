exports.getData = async (request, response, next) => {
  try {
    const allData = await 'this is all the data...';
    response.send(allData);
  } catch (err) {
    next(err);
  }
};
