const express = require('express');

const cors = require('cors');
const app = express();
const port = 5005;

app.use(cors());
app.use(express.json());
app.use('/', (request, response) => {
  response.send('Hello World');
});

app.listen(port, () => {
  console.log('Server is listening on port ', port);
});
