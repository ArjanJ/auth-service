const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
require('dotenv').config();

const routes = require('./routes/');
const auth0Token = require('./middleware/auth0Token');

const app = express();
const PORT = process.env.PORT || 7070;

app.use(
  session({
    secret: 'dank',
    store: new MemoryStore({
      checkPeriod: 86400,
    }),
  }),
);
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(auth0Token);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
