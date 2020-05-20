const jwt = require('jsonwebtoken');

//to allow users to go to private routes

module.exports = function (request, response, next) {
  const token = request.header('x-auth-token');

  if (!token) {
    return response.status(401).json({ msg: 'no token, authorization denied' });
  }

  try {
    //need to move to .env file
    const decoded = jwt.verify(token, 'secret');
    request.user = decoded.user;
    next();
  } catch (error) {
    response.status(401).json({ msg: 'token not valid' });
  }
};
