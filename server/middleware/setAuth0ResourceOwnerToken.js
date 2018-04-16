const { getResourceOwnerToken } = require('../mutations/auth0/token/');

const IS_DEV = process.env.NODE_ENV === 'development';

const setAuth0ResourceOwnerToken = async (req, res, next) => {
  const { email = '', password = '', username = '' } = req.body;

  if (!password) {
    return res.status(401).send({ data: null, error: {} });
  }

  const token = await getResourceOwnerToken(username || email, password);

  if (token.error) {
    return res.status(401).send({ data: null, error: token });
  }

  if (token.id_token) {
    const { id_token: idToken, expires_in: expiresIn } = token;
    const domain = IS_DEV ? 'localhost' : '.jassal.io';
    // Convert seconds to milliseconds.
    const maxAge = expiresIn * 1000;
    const secure = !IS_DEV;
    res.cookie('idToken', idToken, { domain, maxAge, secure });
    res.status(200).send({ data: null, error: null });
  } else {
    return res.status(401).send({ data: null, error: {} });
  }

  return next();
};

module.exports = setAuth0ResourceOwnerToken;
