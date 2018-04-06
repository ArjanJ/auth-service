const routes = require('express').Router();
const axios = require('axios');
const path = require('path');

const checkManagementToken = require('../middleware/checkManagementToken');
const parseBearerToken = require('../middleware/parseBearerToken');

const { AUTH0_URL } = process.env;

const auth0Api = axios.create({
  baseURL: AUTH0_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function setAuthorizationHeader(auth0token = '') {
  if (!auth0Api.defaults.headers.Authorization) {
    auth0Api.defaults.headers.Authorization = `Bearer ${auth0token}`;
  }
}

/**
 * Create a user
 */
routes.post('/v1/signup', checkManagementToken, async (req, res) => {
  setAuthorizationHeader(req.auth0Token);
  try {
    const response = await auth0Api.post('/users', req.body);
    return res.status(response.status).send(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).send(err.response.data || {});
    }
    return res.status(500).send({ error: true });
  }
});

/**
 * Get a user
 */
routes.get(
  '/v1/auth/user',
  [parseBearerToken, checkManagementToken],
  async (req, res) => {
    setAuthorizationHeader(req.auth0Token);
    const userId = req.bearerToken.sub;
    try {
      const response = await auth0Api.get(`/users/${userId}`);
      return res.status(response.status).send(response.data);
    } catch (err) {
      if (err.response) {
        return res.status(err.response.status).send(err.response.data || {});
      }
      return res.status(500).send({ error: true });
    }
  },
);

routes.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = routes;
