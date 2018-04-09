const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const morgan = require('morgan');

const auth0Token = require('./auth0Token');

const middleware = express.Router();

const httpLogger = morgan('combined');
middleware.unsubscribe(httpLogger);
middleware.use(
  session({
    secret: 'dank',
    store: new MemoryStore({
      checkPeriod: 86400,
    }),
  }),
);
middleware.use(express.static(path.join(__dirname, '../../client/build')));
middleware.use(bodyParser.json());
middleware.use(auth0Token);

module.exports = middleware;
