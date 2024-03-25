import express from "express";
import {
  validateCreateUserBody,
  validateVerifyUserBody,
  validateLoginUserBody,
} from "../helpers/validateBody.js";
import {
  signup,
  login,
  logout,
  getCurrentUser,
  updateMe,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/usersControllers.js";
import protect, {  uploadAvatar } from "../middlewares/usersMiddlewares.js";

const userRouter = express.Router();

userRouter.post("/register", validateCreateUserBody, signup);
userRouter.get("/verify/:verificationToken", verifyEmail);
userRouter.post("/verify", validateVerifyUserBody, resendVerifyEmail);
userRouter.post("/login", validateLoginUserBody, login);
userRouter.post("/logout", logout);
userRouter.get("/current", protect, getCurrentUser);
userRouter.patch("/avatars", protect, uploadAvatar, updateMe);

export default userRouter;