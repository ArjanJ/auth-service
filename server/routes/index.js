const routes = require('express').Router();
const axios = require('axios');
const path = require('path');
const checkToken = require('../middleware/checkToken');

const { AUTH0_URL } = process.env;

const auth0Api = axios.create({
  baseURL: AUTH0_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function setBearerToken(auth0token = '') {
  if (!auth0Api.defaults.headers.Authorization) {
    auth0Api.defaults.headers.Authorization = `Bearer ${auth0token}`;
  }
}

routes.post('/v1/auth/users', checkToken, async (req, res) => {
  setBearerToken(req.auth0Token);
  try {
    const response = await auth0Api.post('/users', req.body);
    return res.status(response.status).send(response.data);
  } catch (e) {
    if (e.response) {
      return res.status(e.response.status).send(e.response.data || {});
    }
    return res.status(500).send({ error: true });
  }
});

routes.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = routes;
