const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const morgan = require('morgan');

const setNamespace = require('./setNamespace');

const middleware = express.Router();

const httpLogger = morgan('combined');
middleware.use(httpLogger);
middleware.use(
  session({
    secret: 'dank',
    store: new MemoryStore({
      checkPeriod: 86400,
    }),
  }),
);
middleware.use(setNamespace);
middleware.use(express.static(path.join(__dirname, '../../client/build')));
middleware.use(bodyParser.json());

module.exports = middleware;
