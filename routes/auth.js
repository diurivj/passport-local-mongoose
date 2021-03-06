const router = require('express').Router();
const User = require('../models/User');
const passport = require('../config/passport');
const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'Sign up',
    register: true // esto lo pongo para decirle al form que es registro y muestre el name y el lastname
  };
  res.render('auth/form', config);
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password);
    console.log(user);
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.send('El usuario ya existe');
  }
});

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log in',
    action: '/login',
    button: 'Login'
  };
  res.render('auth/form', config);
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile'
  })
);

router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('auth/profile', { loggedUser: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

router.get('/facebook/login', passport.authenticate('facebook', { scope: 'email' }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', scope: 'email' }),
  function(req, res) {
    req.app.locals.loggedUser = req.user;
    res.redirect('/profile');
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
