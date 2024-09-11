import { Router } from "express";
import products from "../mockUsers/products.mjs";
import {
  query,
  matchedData,
  checkSchema,
  validationResult,
} from "express-validator";

const router = Router();

router.get("/api/products", (request, response) => {
  if (request.signedCookies.name && request.signedCookies.name === "David") {
    return response.status(200).send(products);
  }
  return response
    .status(403)
    .send({ msg: "Sorry you need the correct cookie" });
});

router.get("/api/products/:id", (request, response) => {});
router.post("/api/products/:id", (request, response) => {});
router.put("/api/products/:id", (request, response) => {});
router.patch("/api/products/:id", (request, response) => {});
router.delete("/api/products/:id", (request, response) => {});

export default router;
