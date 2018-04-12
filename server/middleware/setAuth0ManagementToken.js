const { getManagementToken } = require('../mutations/auth0/token/');
const auth0Client = require('../utils/auth0Client');

const setAuth0ManagementToken = async (req, res, next) => {
  const { session } = req;

  // Check if token has expired or does not exist.
  if (
    !session.auth0ManagementToken ||
    session.auth0ManagementTokenExpiresAt < Date.now()
  ) {
    // Fetch new access token.
    const token = await getManagementToken();

    if (token.access_token) {
      const now = Date.now();
      const expiresIn = now + token.expires_in;
      // Set date for when token expires so we can check it later.
      session.auth0ManagementTokenExpiresAt = expiresIn;
      // Cache the token so we don't get new ones uneccessarily.
      session.auth0ManagementToken = token.access_token;
      // Set header on axios http client.
      auth0Client.defaults.headers.Authorization = `Bearer ${
        token.access_token
      }`;
    }
    next();
  }
};

module.exports = setAuth0ManagementToken;
