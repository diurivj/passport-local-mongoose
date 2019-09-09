const passport = require('passport');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook');

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(
  new FacebookStrategy(
    {
      clientID: '470323546898176',
      clientSecret: '14f19ba4f5d282886730b3e14703ed1e',
      callbackURL: 'http://localhost:3000/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ facebookId: profile.id })
        .then((user) => {
          if (user) {
            return cb(null, user);
          } else {
            User.create({ name: profile.displayName, facebookId: profile.id, email: profile.emails[0].value })
              .then((newUser) => {
                return cb(null, newUser);
              })
              .catch((err) => console.log('sd', err));
          }
        })
        .catch((err) => console.log('otor', err));
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
