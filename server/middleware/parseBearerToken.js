const jwtDecode = require('jwt-decode');

const HEADER_KEY = 'Bearer';

/**
 * parseBearerToken
 * Checks for JWT in req.headers.authorization and if it exists,
 * decodes it and adds it to req.userInfo.
 */
const parseBearerToken = (req, res, next) => {
  let token = null;

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === HEADER_KEY) {
      [, token] = parts;
      req.userInfo = jwtDecode(token);
    }
  }

  if (!token) {
    res.status(401).send({ data: null, error: true });
  } else {
    next();
  }
};

module.exports = parseBearerToken;
