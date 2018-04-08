const auth0Client = require('../../../utils/auth0Client');

const getAllConnections = async (query = '') => {
  try {
    const response = await auth0Client.get(`/connections?${query}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = getAllConnections;
