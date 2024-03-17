import express from 'express';
import { validateCreateUserBody } from '../helpers/validateBody.js';
import {
  signup,
  login,
  logout,
  getCurrentUser,
} from '../controllers/usersControllers.js';
import protect from '../middlewares/usersMiddlewares.js';

const userRouter = express.Router();

userRouter.post('/register', validateCreateUserBody, signup);
userRouter.post('/login', validateCreateUserBody, login);
userRouter.post('/logout', protect, logout);
userRouter.get('/current', protect, getCurrentUser);
export default userRouter;
