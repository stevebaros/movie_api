const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
    {
      usernameField: 'Name',
      passwordField: 'Password',
    },
    (username, password, callback) => {
      console.log('Local strategy', { username, password });
    Users.findOne({ Name: username })
      .then((user) => {
        console.log('User from DB:', user);
        if (!user) {
          console.log('User not found');
          return callback(null, false, { message: 'Incorrect Username or Password' });
        }

        const isValidPassword = user.validatePassword(password);
        console.log('Password is valid:', isValidPassword);

        if (!isValidPassword) {
          return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, user);
      })
      .catch((error) => {
        console.log('Error in Passport strategy:', error);
        return callback(error);
      });
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'MyJWTSecret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));