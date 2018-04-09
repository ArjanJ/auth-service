const axios = require('axios');

const CONNECTION = 'Username-Password-Authentication';

const changePassword = async (email = '', connection = CONNECTION) => {
  try {
    const response = await axios.post(
      'https://arjan.auth0.com/dbconnections/change_password',
      {
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        connection,
        email,
      },
    );
    return response.data;
  } catch (err) {
    return err.data;
  }
};

module.exports = changePassword;
