const { Router } = require('express');

const { getUser } = require('../mutations/auth0/user/');
const { changePassword } = require('../mutations/auth0/changePassword/');
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

userRouter.post('/change-password', async (req, res) => {
  console.log(req.body.email);
  const r = await changePassword(req.body.email);
  console.log(r);
  res.status(200).send('ok');
});

module.exports = userRouter;
