const { Router } = require('express');

const setAuth0ManagementToken = require('../middleware/setAuth0ManagementToken');
const parseBearerToken = require('../middleware/parseBearerToken');
const { getUser } = require('../mutations/auth0/user/');

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
  console.log(req.namespace);
  res.status(200).send('ok');
});

module.exports = userRouter;
