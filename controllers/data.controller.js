const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/thumbnail.json');

exports.getData = async (request, response, next) => {
  try {
    fs.readFile(dbPath, 'utf8', (err, data) => {
      if (err) {
        response.send(err.message);
      }
      response.send(JSON.parse(data));
    });
  } catch (err) {
    next(err);
  }
};
