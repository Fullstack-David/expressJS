import passport from "passport";
import { Strategy } from "passport-local";
import mockUsers from "../mockUsers/mockUsers.mjs";

// kan inte se att loggas ut??
passport.serializeUser((user, done) => {
  console.log("Inside serialzeUser");
  console.log(user);
  done(null, user.id);
});

// kan inte se att loggas ut??
passport.deserializeUser((id, done) => {
  console.log("Inside DeserialzeUser");
  console.log(`Deserialzing user ID: ${id}`);
  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found!");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

// kan inte se att loggas ut??
export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password)
        throw new Error("Password dont match!");
      done(null, findUser); // null cuz it was not any error and we show data (findUser)
    } catch (error) {
      done(error, null);
    }
  })
);
