const { Router } = require('express');

const setAuth0ManagementToken = require('../middleware/setAuth0ManagementToken');
const parseBearerToken = require('../middleware/parseBearerToken');
const { createUser, getUser } = require('../mutations/auth0/user/');

const userRouter = Router();

userRouter.get(
  '/',
  [setAuth0ManagementToken, parseBearerToken],
  async (req, res) => {
    const { sub = '' } = req.userInfo;

    if (!sub) {
      return res.status(400).send({ data: null, error: true });
    }

    const user = await getUser(sub);
    return res.status(200).send({ data: user, error: null });
  },
);

userRouter.post('/invite', [setAuth0ManagementToken], async (req, res) => {
  const userBody = {
    app_metadata: {
      [req.namespace]: {
        role: 'EDITOR',
      },
    },
    connection: 'email',
    email: req.body.email,
    verify_email: false,
    email_verified: true,
  };

  const invitedUser = await createUser(userBody);

  if (invitedUser.error) {
    res
      .status(400)
      .send({ data: null, error: invitedUser })
      .end();
  }

  res.status(200).send({ data: invitedUser, error: null });
});

module.exports = userRouter;
