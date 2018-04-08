const auth0Client = require('../../../utils/auth0Client');

const createUser = async (user = {}) => {
  try {
    const response = await auth0Client.post('/users', user);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = createUser;
