const axios = require('axios');

const {
  AUTH0_AUTHENTICATION_URL,
  AUTH0_AUTHENTICATION_CLIENT_ID,
  AUTH0_AUTHENTICATION_CLIENT_SECRET,
  AUTH0_MANAGEMENT_CLIENT_ID,
  AUTH0_MANAGEMENT_CLIENT_SECRET,
  AUTH0_MANAGEMENT_AUDIENCE,
} = process.env;

const URL = `${AUTH0_AUTHENTICATION_URL}/oauth/token`;
const headers = {
  'content-type': 'application/json',
};

const CLIENT_CREDENTIALS = 'client_credentials';
const PASSWORD = 'password';

// For Auth0 Management API
const getManagementToken = async () => {
  try {
    const response = await axios({
      data: JSON.stringify({
        audience: AUTH0_MANAGEMENT_AUDIENCE,
        client_id: AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: AUTH0_MANAGEMENT_CLIENT_SECRET,
        grant_type: CLIENT_CREDENTIALS,
      }),
      headers,
      method: 'POST',
      url: URL,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

// For end user authenticating with username and password.
const getResourceOwnerToken = async (username = '', password = '') => {
  try {
    const response = await axios({
      data: JSON.stringify({
        client_id: AUTH0_AUTHENTICATION_CLIENT_ID,
        client_secret: AUTH0_AUTHENTICATION_CLIENT_SECRET,
        grant_type: PASSWORD,
        password,
        username,
      }),
      headers,
      method: 'POST',
      url: URL,
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = {
  getManagementToken,
  getResourceOwnerToken,
};
