const axios = require('axios');

const auth0Client = axios.create({
  baseURL: process.env.AUTH0_MANAGEMENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = auth0Client;
