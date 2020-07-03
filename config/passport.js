const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Load user model
const user = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        // match user
        user
          .findOne({ where: { username: username } })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That username is not registered",
              });
            }

            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user.findOne({ where: { id: id } }).then((user) => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
