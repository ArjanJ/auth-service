const { Router } = require('express');

const { createUser, getAllUsers } = require('../mutations/auth0/user/');
const { screamingSnakeCase } = require('../utils/stringUtils');

const signupRouter = Router();

signupRouter.post('/', async (req, res) => {
  // Parse organization, "Red Truck" -> "RED_TRUCK".
  const organization = screamingSnakeCase(req.body.organization);
  // Query to see if this organization already has an owner, i.e it exists.
  const allUsersQuery = `app_metadata.${organization}.role:"OWNER"`;
  const organizationOwner = await getAllUsers(allUsersQuery);
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
  return res.status(200).send({ data: user, error: null });
});

module.exports = signupRouter;
