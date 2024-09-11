import express, { request, response } from "express";
import mockUsers from "./mockUsers/mockUsers.mjs";
import products from "./mockUsers/products.mjs";
import resolveIndexByUserId from "./middleware/middleware.mjs";
import createUserValidationSchema from "./utils/validationSchemas.mjs";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

const app = express();

// express parsar inte json by default så vi måste lägga till detta
// this is a middleware och måste vara innan alla routes
app.use(express.json());

const PORT = process.env.PORT || 3000;

// http://localhost:3000/
app.get("/", (request, response) => {
  response.json({ fullname: "David Heidari", age: 29, student: true });
});

// http://localhost:3000/api/users
// Middleware
// Validation
app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be a string!")
    .notEmpty()
    .withMessage("Must not be empty!")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

//* POST-REQUEST
app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ error: result.array() });

    const data = matchedData(request);
    console.log(data);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

//* PUT-REQUEST
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

//* PATCH-REQUEST
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//* DELETE-REQUEST
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

// http://localhost:3000/api/users/2
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

// http://localhost:3000/api/products
app.get("/api/products", (request, response) => {
  response.status(200).send(products);
});

app.listen(PORT, () => {
  console.log(`App is running at port ${PORT} http://localhost:3000/api/users`);
});
