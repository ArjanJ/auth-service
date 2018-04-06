const getAuth0Token = require('../token/token');

const checkToken = async (req, res, next) => {
  const { session } = req;
  if (!session.auth0Token || session.auth0TokenExpiresAt < Date.now()) {
    const token = await getAuth0Token();
    if (token.access_token) {
      const now = Date.now();
      const expiresIn = now + token.expires_in;
      // Set date for when token expires so we can check it later.
      session.auth0TokenExpiresAt = expiresIn;
      // Cache the token so we don't get new ones uneccessarily.
      session.auth0Token = token.access_token;
      // Set Bearer token on default headers for auth0 requests.
      req.auth0Token = token.access_token;
    }
    next();
  }
};

module.exports = checkToken;
