import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import mockUsers from "../mockUsers/mockUsers.mjs";
import resolveIndexByUserId from "../middleware/middleware.mjs";
import createUserValidationSchema from "../utils/validationSchemas.mjs";
import { User } from "../mongoose/schemas/userSchema.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be a string!")
    .notEmpty()
    .withMessage("Must not be empty!")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (error, sessionData) => {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(sessionData);
    });
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

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

//* checkSchema och validation router
// router.post(
//   "/api/users",
//   checkSchema(createUserValidationSchema),
//   (request, response) => {
//     const result = validationResult(request);
//     console.log(result);

//     if (!result.isEmpty())
//       return response.status(400).send({ error: result.array() });

//     const data = matchedData(request);
//     console.log(data);
//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return response.status(201).send(newUser);
//   }
// );

//* connectting to mongodb-database
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());
    const data = matchedData(request);
    console.log(data);

    data.password = hashPassword(data.password);
    console.log(data);

    const newUser = new User(data);

    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (error) {
      console.log(`Error: ${error}`);
      return response.status(400).send("Bad Request");
    }
  }
);

router.patch(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.array() });
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
  }
);

router.put(
  "/api/users/:id",
  resolveIndexByUserId,
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ error: result.array() });
    const data = matchedData(request);
    const { findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...data };
    return response.sendStatus(200);
  }
);

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
