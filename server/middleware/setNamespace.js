const extractBearerToken = require('../utils/extractBearerToken');

const getNamespace = (jwt = {}) => {
  // Auth0 forces you to namespace any custom fields you add to JWT.
  const appMetadataKey = 'https://api.jassal.io/app_metadata';

  // Assumes there is only one organization the user belongs to.
  const namespaceKeys = Object.keys(jwt[appMetadataKey]);

  if (namespaceKeys.length > 0) {
    const [namespace] = namespaceKeys;
    return namespace;
  }

  return null;
};

const setNamespace = (req, res, next) => {
  let namespace = null;

  const decodedToken = extractBearerToken(req.headers);

  if (decodedToken) {
    namespace = getNamespace(decodedToken);
  }

  if (req.userInfo) {
    namespace = getNamespace(req.userInfo);
  }

  if (namespace) {
    req.namespace = namespace;
  }

  next();
};

module.exports = setNamespace;
