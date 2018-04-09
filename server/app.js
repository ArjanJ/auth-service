const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 7070;
const middleware = require('./middleware/');
const routes = require('./routes/');

const app = express()
  .use(middleware)
  .use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
