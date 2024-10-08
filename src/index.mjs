import express from "express";
import usersRouter from "./routes/userRouter.mjs";
import productRouter from "./routes/productRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import createUserValidationSchema from "./utils/validationSchemas.mjs";
import { checkSchema } from "express-validator";
import authRouter from "./routes/auth.mjs";
import cartRouter from "./routes/cartRouter.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
// import "./strategies/local-strategy copy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./strategies/discord-strategy.mjs";
import dotenv from "dotenv";

dotenv.config();
const app = express();

mongoose
  .connect("mongodb://localhost/express_js")
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.log(`Error: ${error}`));

// express parsar inte json by default så vi måste lägga till detta
// this is a middleware och måste vara innan alla routes
app.use(express.json());

// behöver vara innan alla routes signed: måse finnas en string value
app.use(cookieParser("Helloworld"));
app.use(
  session({
    secret: "David The Dev", // denna måste vara lika säker som ett lösenord
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    // save data in sessionStore
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

// Must be after session nad before routes
app.use(passport.initialize());
app.use(passport.session());
app.use(usersRouter);
app.use(productRouter);
app.use(authRouter);
app.use(cartRouter);

const PORT = process.env.PORT || 3000;

// cookies
app.get("/", checkSchema(createUserValidationSchema), (request, response) => {
  console.log(request.session.id);
  request.session.visited = true; // session-id kommer vara samma
  response.cookie("name", "David", { maxAge: 60000 * 60, signed: true });
  response.status(201).send({ msg: "Hello" });
});

app.get("/api/auth/status", (request, response) => {
  console.log("Inside /auth/status/endpoint");
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.status(401);
  request.logout((error) => {
    if (error) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

// app.get("/api/auth/discord", passport.authenticate("discord"));

// när du går in i denna länk första gången så funkar den
// Andra gången måste du tabort cookies för att det ska funka
app.get(
  "/api/auth/discord",
  passport.authenticate("discord", { session: false })
);

app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.sendStatus(200);
  }
);

app.listen(PORT, () => {
  console.log(
    `App is running at port ${PORT} =>   http://localhost:3000/api/users`
  );
});

// mongodb+srv://<db_username>:<db_password>@superheroes.bydwz4d.mongodb.net/

// client-secret =  E7WaW-xWd2GJtkyG9FoG9qPRfSlO0e-S
// client_id = 1284043293453193246

// http://localhost:3000/api/auth/discord/redirect

// generated URL to discord
// https://discord.com/oauth2/authorize?client_id=1284043293453193246&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify
