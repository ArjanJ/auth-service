const { Router } = require('express');

const { NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === 'development';

const { createUser, getAllUsers } = require('../mutations/auth0/user/');
const { getResourceOwnerToken } = require('../mutations/auth0/token/');
const { changePassword } = require('../mutations/auth0/changePassword/');
const { screamingSnakeCase } = require('../utils/stringUtils');

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  // Parse organization, "Red Truck" -> "RED_TRUCK".
  const organization = screamingSnakeCase(req.body.organization);
  // Query to see if this organization already has an owner, i.e it exists.
  const allUsersQuery = `app_metadata.${organization}.role:"OWNER"`;
  const organizationOwner = await getAllUsers(allUsersQuery);
  console.log('1');
  const organizationExists =
    Array.isArray(organizationOwner) && organizationOwner.length > 0;

  if (organizationExists) {
    return res.status(200).send({ data: null, error: 'ORGANIZATION_EXISTS' });
  }

  // Create new User with OWNER role under new organization.
  const userBody = {
    app_metadata: {
      [organization]: {
        role: 'OWNER',
      },
    },
    connection: 'Username-Password-Authentication',
    email: req.body.email,
    password: req.body.password,
  };

  // Create a new user with the role of OWNER under this new connection.
  const user = await createUser(userBody);

  console.log('2');

  if (user) {
    // Now we authenticate the user who is the resource owner.
    const token = await getResourceOwnerToken(user.email, req.body.password);
    // If we successfully receive the tokens we set a cookie on the response.
    if (token.id_token) {
      const { id_token, expires_in } = token;
      const domain = IS_DEV ? 'localhost' : '.jassal.io';
      const maxAge = expires_in;
      const secure = !IS_DEV;
      res.cookie('idToken', id_token, { domain, maxAge, secure });
      return res.status(200).send({ data: user, error: null });
    }
  }
});

authRouter.post('/login', async (req, res) => {
  const { password = '', username = '' } = req.body;
  if (password && username) {
    const token = await getResourceOwnerToken(username, password);
    if (token.id_token) {
      const { id_token, expires_in } = token;
      const domain = IS_DEV ? 'localhost' : '.jassal.io';
      // Convert seconds to milliseconds.
      const maxAge = expires_in * 1000;
      const secure = !IS_DEV;
      res.cookie('idToken', id_token, { domain, maxAge, secure });
      return res.status(200).send({ data: null, error: null });
    }
  }

  return res.status(401).send({ data: null, error: 'INCORRECT_CREDENTIALS' });
});

authRouter.post('/change-password', async (req, res) => {
  const response = await changePassword(req.body.email);
  if (response) {
    res.status(200).send('ok');
  } else {
    res.status(400).send('ded');
  }
});

module.exports = authRouter;
