import express from "express";
import usersRouter from "./routes/userRouter.mjs";
import productRouter from "./routes/productRouter.mjs";
import cookieParser from "cookie-parser";

const app = express();
// express parsar inte json by default så vi måste lägga till detta
// this is a middleware och måste vara innan alla routes
app.use(express.json());

// behöver vara innan alla routes
// signed: måse finnas en string value
app.use(cookieParser("Helloworld"));

app.use(usersRouter);
app.use(productRouter);

const PORT = process.env.PORT || 3000;

// cookies
app.get("/", (request, response) => {
  console.log(request.headers.cookie);
  response.cookie("name", "David", { maxAge: 60000 * 60, signed: true });
  response.status(201).send({ msg: "Hello" });
});

app.listen(PORT, () => {
  console.log(
    `App is running at port ${PORT} =>   http://localhost:3000/api/users`
  );
});
