import { Router } from "express";
import router from "./userRouter.mjs";
import mockUsers from "../mockUsers/mockUsers.mjs";
import "../strategies/local-strategy.mjs";

const authRouter = Router();

// Authenticate api
router.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response
      .status(401)
      .send({ msg: "There is no user or password dont match" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

// get the status av Authenticate api
router.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (error, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response
        .status(401)
        .send({ msg: "There is no user or password dont match" });
});

export default authRouter;
