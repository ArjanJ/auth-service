const axios = require('axios');

const {
  AUTH0_AUTHENTICATION_URL,
  AUTH0_AUTHENTICATION_CLIENT_ID,
} = process.env;

const headers = {
  'content-type': 'application/json',
};

const logout = async (
  returnTo = '',
  clientId = AUTH0_AUTHENTICATION_CLIENT_ID,
) => {
  try {
    const URL = `${AUTH0_AUTHENTICATION_URL}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
    const response = await axios({
      headers,
      method: 'GET',
      url: URL,
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

module.exports = logout;
