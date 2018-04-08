const { Router } = require('express');

const {
  createConnection,
  getConnections,
} = require('../mutations/auth0/connection/');
const { createUser } = require('../mutations/auth0/user/');
const {
  screamingKebabCase,
  screamingSnakeCase,
} = require('../utils/stringUtils');

const signupRouter = Router();

signupRouter.post('/', async (req, res) => {
  // Parse organization, "Red Truck" -> "RED-TRUCK".
  const connectionName = screamingKebabCase(req.body.organization);
  const connectionsQuery = `name=${connectionName}&strategy=auth0`;
  const connections = await getConnections(connectionsQuery);

  // Check if any connections with that organization name exist.
  const connectionExists = Array.isArray(connections) && connections.length > 0;

  if (connectionExists) {
    return res.status(200).send({
      data: null,
      error: 'ORGANIZATION_EXISTS',
    });
  }

  // If this connection doesn't already exist, create it.
  const newConnection = await createConnection(connectionName);

  if (newConnection.name) {
    // Parse organization, "Red Truck" -> "RED_TRUCK".
    const organization = screamingSnakeCase(req.body.organization);
    // First User in new connection is always OWNER.
    const userBody = {
      app_metadata: {
        [organization]: {
          role: 'OWNER',
        },
      },
      connection: newConnection.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Create a new user with the role of OWNER under this new connection.
    const user = await createUser(userBody);
    return res.status(200).send({ data: user, error: null });
  }
});

module.exports = signupRouter;
