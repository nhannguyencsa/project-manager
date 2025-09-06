import express from "express";

import {z} from "zod";
import { validateRequest } from "zod-express-middleware";
import { registerSchema, loginSchema, verifyEmailSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth-controller.js";

const router = express.Router();

//router.method(path, ...middleware, handler)
/*
validateRequest({
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
})
  */
router.post(
  "/register",
  validateRequest({
    body: registerSchema
  }),
  registerUser
)

router.post(
  "/verify-email",
  validateRequest({
    body: verifyEmailSchema
  }),
  verifyEmail
)

router.post(
  "/login",
  validateRequest({
    body: loginSchema
  }),
  loginUser
)

export default router;