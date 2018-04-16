const auth0Client = require('../../../utils/auth0Client');

const linkAccount = async (userId = '', userIdToBeLinked = '') => {
  const provider = userIdToBeLinked.split('|')[0];
  try {
    const secondaryAccount = {
      user_id: userIdToBeLinked,
      provider,
    };
    const response = await auth0Client.post(
      `/users/${userId}/identities`,
      secondaryAccount,
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = linkAccount;
