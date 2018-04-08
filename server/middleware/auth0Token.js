const { getToken } = require('../mutations/auth0/token/');
const auth0Client = require('../utils/auth0Client');

const auth0Token = async (req, res, next) => {
  const { session } = req;

  // Check if token has expired or does not exist.
  if (!session.auth0Token || session.auth0TokenExpiresAt < Date.now()) {
    // Fetch new access token.
    const token = await getToken();

    if (token.access_token) {
      const now = Date.now();
      const expiresIn = now + token.expires_in;
      // Set date for when token expires so we can check it later.
      session.auth0TokenExpiresAt = expiresIn;
      // Cache the token so we don't get new ones uneccessarily.
      session.auth0Token = token.access_token;
      // Set header on axios http client.
      auth0Client.defaults.headers.Authorization = `Bearer ${
        token.access_token
      }`;
    }
    next();
  }
};

module.exports = auth0Token;
