const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
require('dotenv').config();

const routes = require('./routes/');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  session({
    secret: 'dank',
    store: new MemoryStore({
      checkPeriod: 86400,
    }),
  }),
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
