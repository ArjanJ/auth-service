const { Router } = require('express');
const path = require('path');

const router = Router();
const signupRouter = require('./signup');
const userRouter = require('./user');

router.use('/v1/signup', signupRouter);
router.use('/v1/user', userRouter);

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = router;
