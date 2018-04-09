const { Router } = require('express');

const { getUser } = require('../mutations/auth0/user/');
const parseBearerToken = require('../middleware/parseBearerToken');

const userRouter = Router();

userRouter.get('/', parseBearerToken, async (req, res) => {
  const { sub = '' } = req.userInfo;

  if (!sub) {
    return res.status(400).send({ data: null, error: true });
  }

  const user = await getUser(sub);
  return res.status(200).send({ data: user, error: null });
});

module.exports = userRouter;
