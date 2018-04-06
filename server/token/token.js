const axios = require('axios');

const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

const getAuth0Token = async () => {
  try {
    const response = await axios({
      data: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_AUDIENCE,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
      url: 'https://arjan.auth0.com/oauth/token',
    });

    return response.data;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return e;
  }
};

module.exports = getAuth0Token;
