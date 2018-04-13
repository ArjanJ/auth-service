const { Router } = require('express');
const nodemailer = require('nodemailer');
const encodeurl = require('encodeurl');

const setAuth0ManagementToken = require('../middleware/setAuth0ManagementToken');
const parseBearerToken = require('../middleware/parseBearerToken');
const {
  createUser,
  getAllUsers,
  getUser,
  linkAccount,
} = require('../mutations/auth0/user/');

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  service: 'gmail',
});

const mailOptions = (to = '', html = '') => ({
  from: 'Arjan Jassal',
  to,
  subject: 'Set your password for auth0',
  html,
});

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
  const userQuery = encodeURIComponent(`email:"${req.body.email}"`);
  const users = await getAllUsers(userQuery);
  const userExists = Array.isArray(users) && users.length > 0;

  if (userExists) {
    res
      .status(200)
      .send({ data: null, error: 'USER_EXISTS' })
      .end();
  }

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

  const html = `<p>Click <a href="http://localhost:3000/password#id=${
    invitedUser.user_id
  }" target="_blank">here</a> to set your password.</p>`;
  const emailData = mailOptions(invitedUser.email, html);

  transporter.sendMail(emailData, (err, info) => {
    if (err) {
      console.log(err);
      res
        .status(400)
        .send('rip')
        .end();
    } else {
      console.log(info);
      res
        .status(200)
        .send('ok')
        .end();
    }
  });

  res.status(200).send({ data: invitedUser, error: null });
});

userRouter.post(
  '/link-account',
  [setAuth0ManagementToken, parseBearerToken],
  async (req, res) => {
    const { sub: userId } = req.userInfo;
    const { secondaryUserId = '' } = req.body;
    try {
      const response = await linkAccount(userId, secondaryUserId);
      console.log(response);
      res
        .status(200)
        .send('ok')
        .end();
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send('rip')
        .end();
    }
  },
);

module.exports = userRouter;
