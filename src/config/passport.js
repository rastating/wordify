const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
      User.findOne({ username })
        .then(async user => {
          if (!user) return done(null, false, { message: 'Invalid credentials' });

          const validPassword = await user.validatePassword(password);

          if (validPassword) return done(null, user);
          return done(null, false, { message: 'Invalid credentials' });
        })
        .catch(err => done(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
