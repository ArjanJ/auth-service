const { Router } = require('express');
const path = require('path');

const router = Router();
const authRouter = require('./auth');
const userRouter = require('./user');

router.use('/v1/auth', authRouter);
router.use('/v1/user', userRouter);

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = router;
