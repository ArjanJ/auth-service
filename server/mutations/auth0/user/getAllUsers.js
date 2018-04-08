const auth0Client = require('../../../utils/auth0Client');

const getAllUsers = async (query = '') => {
  try {
    const response = await auth0Client.get(
      `/users?search_engine=v3&q=${query}`,
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = getAllUsers;
