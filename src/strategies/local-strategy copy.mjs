import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { comparePassword } from "../utils/helpers.mjs";

// kan inte se att loggas ut??
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// kan inte se att loggas ut??
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found!");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

// kan inte se att loggas ut??
export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (!comparePassword(password, findUser.password));
      throw new Error("Password dont match.");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
