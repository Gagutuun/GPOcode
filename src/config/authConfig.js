const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await User.findByLoginAndPassword(username, password)
        if (!user) {
          return done(null, false, { message: 'Неправильное имя пользователя или пароль!' });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize only user id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id) // Fetch user by passed id
    return done(null, user);
  } catch(err) {
    return done(err);
  }
});

module.exports = passport;
