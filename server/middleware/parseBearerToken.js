const extractBearerToken = require('../utils/extractBearerToken');

/**
 * parseBearerToken
 * Extracts JWT from bearer token, decodes it, and adds it to req.userInfo.
 */
const parseBearerToken = (req, res, next) => {
  const token = extractBearerToken(req.headers);

  if (!token) {
    res.status(401).send({ data: null, error: true });
  } else {
    req.userInfo = token;
    next();
  }
};

module.exports = parseBearerToken;
