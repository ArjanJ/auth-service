const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';

const AUTH0_DOMAIN = 'arjan.auth0.com';
const AUTH0_CLIENT_ID = 'ehZzZv53ikxMJTneNFYQQ3elLW3bprEQ';
const AUTH0_CALLBACK_URL = isDev
  ? `http://localhost:${PORT}/api/callback`
  : 'https://arjan-service-auth.appspot.com/api/callback';

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    clientSecret:
      'izdh9Dkzi7BtZgj8koPvMfqBo3AOlsJ_E_quC0rgorKsd9GAYBEz3fCTa2KDghGD',
    // callbackURL: AUTH0_CALLBACK_URL,
    callbackURL: 'http://localhost:7070/api/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, { accessToken, refreshToken, extraParams, profile });
  },
);

passport.use(strategy);

app.use(session({ secret: 'mysecret' }));
app.use(passport.initialize());
app.use(passport.session());

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', function(req, res, next) {
  if (req.query.continue) {
    req.session.returnTo = req.query.continue;
  }
  res.redirect('/login');
});

// Perform the login
app.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: AUTH0_CLIENT_ID,
    domain: AUTH0_DOMAIN,
    redirectUri: 'http://localhost:7070/api/callback',
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid',
  }),
  function(req, res) {
    res.redirect('/');
  },
);

app.get('/user', (req, res) => {
  res.send('user');
});

// Perform session logout and redirect to homepage
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
app.get(
  '/api/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/login',
  }),
  function(req, res) {
    const { accessToken, extraParams } = req.user;
    // res.cookie('accessToken', accessToken, {
    //   domain: req.session.returnTo,
    //   expires: new Date(Date.now() + extraParams.expires_in),
    //   secure: true,
    // });
    // res.cookie('id_token', extraParams.id_token, {
    //   domain: req.session.returnTo,
    //   expires: new Date(Date.now() + extraParams.expires_in),
    //   secure: true,
    // });
    res.redirect(req.session.returnTo || '/user');
  },
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
