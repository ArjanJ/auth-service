const { Router } = require('express');

const setAuth0ResourceOwnerToken = require('../middleware/setAuth0ResourceOwnerToken');
const setAuth0ManagementToken = require('../middleware/setAuth0ManagementToken');
const { createUser, getAllUsers } = require('../mutations/auth0/user/');
const { changePassword } = require('../mutations/auth0/changePassword/');
const { screamingSnakeCase } = require('../utils/stringUtils');

const authRouter = Router();

const ROLE_EDITOR = 'EDITOR';
const ROLE_OWNER = 'OWNER';
const CONNECTION_DATABASE = 'jassal-platform';

authRouter.post(
  '/signup',
  setAuth0ManagementToken,
  async (req, res, next) => {
    const role = req.body.invited ? ROLE_EDITOR : ROLE_OWNER;

    // Parse organization, "Red Truck" -> "RED_TRUCK".
    const organization = screamingSnakeCase(req.body.organization);

    if (role === ROLE_OWNER) {
      // Query to see if this organization already has an owner, i.e it exists.
      const allUsersQuery = `app_metadata.${organization}.role:"OWNER"`;
      const organizationOwner = await getAllUsers(allUsersQuery);
      const organizationExists =
        Array.isArray(organizationOwner) && organizationOwner.length > 0;

      if (organizationExists) {
        return res
          .status(200)
          .send({ data: null, error: 'ORGANIZATION_EXISTS' });
      }
    }

    const connection = CONNECTION_DATABASE;

    // Create new User with OWNER role under new organization.
    const userBody = {
      app_metadata: {
        [organization]: {
          role,
        },
      },
      connection,
      email: req.body.email,
      password: req.body.password,
    };

    // Create a new user with the role of OWNER under this new connection.
    const user = await createUser(userBody);

    if (user.error) {
      return res.status(user.statusCode).send({ data: null, error: user });
    }

    return next();
  },
  setAuth0ResourceOwnerToken,
);

authRouter.post('/login', setAuth0ResourceOwnerToken);

authRouter.post(
  '/change-password',
  setAuth0ManagementToken,
  async (req, res) => {
    const response = await changePassword(req.body.email);
    if (response) {
      res.status(200).send('ok');
    } else {
      res.status(400).send('ded');
    }
  },
);

module.exports = authRouter;
