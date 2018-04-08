const auth0Client = require('../../../utils/auth0Client');

const createConnection = async (name = '') => {
  try {
    const createConnectionBody = {
      enabled_clients: [process.env.AUTH0_CLIENT_ID],
      name,
      strategy: 'auth0',
    };
    const response = await auth0Client.post(
      '/connections',
      createConnectionBody,
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = createConnection;
