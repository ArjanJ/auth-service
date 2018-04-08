const auth0Client = require('../../../utils/auth0Client');

const getUser = async (userId = '') => {
  try {
    const response = await auth0Client.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = getUser;
