import express, { request, response } from "express";
import usersRouter from "./routes/userRouter.mjs";
import productRouter from "./routes/productRouter.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import createUserValidationSchema from "./utils/validationSchemas.mjs";
import { checkSchema } from "express-validator";
import mockUsers from "./mockUsers/mockUsers.mjs";

const app = express();
// express parsar inte json by default så vi måste lägga till detta
// this is a middleware och måste vara innan alla routes
app.use(express.json());

// behöver vara innan alla routes
// signed: måse finnas en string value
app.use(cookieParser("Helloworld"));
app.use(
  session({
    secret: "David The Dev", // denna måste vara lika säker som ett lösenord
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(usersRouter);
app.use(productRouter);

const PORT = process.env.PORT || 3000;

// cookies
app.get("/", checkSchema(createUserValidationSchema), (request, response) => {
  console.log(request.session.id);
  request.session.visited = true; // session-id kommer vara samma
  response.cookie("name", "David", { maxAge: 60000 * 60, signed: true });
  response.status(201).send({ msg: "Hello" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "Bad credentials" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (error, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(
    `App is running at port ${PORT} =>   http://localhost:3000/api/users`
  );
});
