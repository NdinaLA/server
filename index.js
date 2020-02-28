const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./middleware/meta.routes');
const port = 5005;

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log('Server is listening on port ', port);
});
