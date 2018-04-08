const { Router } = require('express');

const router = Router();
const signupRouter = require('./signup');
const userRouter = require('./user');

router.use('/v1/signup', signupRouter);
router.use('/v1/user', userRouter);

module.exports = router;

// const routes = require('express').Router();
// const path = require('path');

// const {
//   createConnection,
//   getConnections,
// } = require('../mutations/auth0/connection/');
// const { createUser, getUser } = require('../mutations/auth0/user/');
// const parseOrganization = require('../utils/parseOrganization');

// routes.post('/v1/signup', async (req, res) => {
//   const organization = parseOrganization(req.body.organization);
//   const connectionsQuery = `name=${organization}&strategy=auth0`;
//   const connections = await getConnections(connectionsQuery);

//   const connectionExists = Array.isArray(connections) && connections.length > 0;

//   if (connectionExists) {
//     return res.status(200).send({
//       data: null,
//       error: 'ORGANIZATION_EXISTS',
//     });
//   }

//   const newConnection = await createConnection(organization);
//   const userBody = {
//     app_metadata: {
//       [organization]: {
//         role: 'OWNER',
//       },
//     },
//     connection: newConnection.name,
//     email: req.body.email,
//     password: req.body.password,
//   };
//   const user = await createUser(userBody);
//   return res.status(200).send({ data: user, error: null });
// });

// routes.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
// });

// module.exports = routes;

// // /**
// //  * Get a user
// //  */
// // routes.get(
// //   '/v1/auth/user',
// //   [parseBearerToken, checkManagementToken],
// //   async (req, res) => {
// //     setAuthorizationHeader(req.auth0Token);
// //     const userId = req.bearerToken.sub;
// //     try {
// //       const response = await auth0Api.get(`/users/${userId}`);
// //       return res.status(response.status).send(response.data);
// //     } catch (err) {
// //       if (err.response) {
// //         return res.status(err.response.status).send(err.response.data || {});
// //       }
// //       return res.status(500).send({ error: true });
// //     }
// //   },
// // );

// // routes.get('*', (req, res) => {
// //   res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
// // });

// // module.exports = routes;
