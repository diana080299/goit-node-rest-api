import { userService } from '../services/userService.js';
import { catchAsync } from '../helpers/catchAsync.js';

export const signup = catchAsync(async (req, res) => {
  const userExists = await userService.checkUserExists({
    email: req.body.email,
  });

  if (userExists) {
    return res.status(409).json({
      message: 'Email  in use',
    });
  }

  const newUser = await userService.signup(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const user = await userService.login(req.body);

  res.status(200).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
    token: user.token,
  });
});
export const logout = catchAsync(async (req, res) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ') &&
    req.headers.authorization.split(' ')[1];

  await userService.logout(token);
  res.status(204).send();
});
export const getCurrentUser = (req, res) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};
