import express from 'express';
import { validateCreateUserBody } from '../helpers/validateBody.js';
import {
  signup,
  login,
  logout,
  getCurrentUser,
  updateMe,
} from '../controllers/usersControllers.js';
import protect, { uploadAvatar } from '../middlewares/usersMiddlewares.js';

const userRouter = express.Router();

userRouter.post('/register', validateCreateUserBody, signup);
userRouter.post('/login', validateCreateUserBody, login);
userRouter.post('/logout', logout);
userRouter.get('/current', protect, getCurrentUser);
userRouter.patch('/avatars', protect, uploadAvatar, updateMe);

export default userRouter;
