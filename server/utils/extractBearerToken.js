const jwtDecode = require('jwt-decode');

const HEADER_KEY = 'Bearer';

const extractBearerToken = (headers = {}, decode = true) => {
  let bearerToken = null;

  if (headers && headers.authorization) {
    const parts = headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === HEADER_KEY) {
      const [, token] = parts;
      bearerToken = decode ? jwtDecode(token) : token;
    }
  }

  return bearerToken;
};

module.exports = extractBearerToken;
