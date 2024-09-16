import passport from "passport";
import { Strategy } from "passport-discord";
import dotenv from "dotenv";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";
dotenv.config();

// kan inte se att loggas ut??
passport.serializeUser((user, done) => {
  console.log("Inside serialzeUser");
  console.log(user);
  done(null, user.id);
});

// kan inte se att loggas ut??
passport.deserializeUser(async (id, done) => {
  console.log("Inside DeserialzeUser");
  console.log(`Deserialzing user ID: ${id}`);
  try {
    const findUser = await DiscordUser.findByID(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
