const axios = require('axios');

const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

const URL = 'https://arjan.auth0.com/oauth/token';
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
        audience: AUTH0_AUDIENCE,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
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
        client_id: 'ehZzZv53ikxMJTneNFYQQ3elLW3bprEQ',
        client_secret:
          'izdh9Dkzi7BtZgj8koPvMfqBo3AOlsJ_E_quC0rgorKsd9GAYBEz3fCTa2KDghGD',
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
