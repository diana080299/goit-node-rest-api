import { jwtService } from '../services/jwtService.js';
import { userService } from '../services/userService.js';
import HttpError from '../helpers/HttpError.js';
import { catchAsync } from '../helpers/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];
    const userId = jwtService.checkToken(token);

    if (!userId) {
      throw new HttpError(401, 'Not authorized');
    }

    const currentUser = await userService.getUserById(userId);

    if (!currentUser || currentUser.token !== token) {
      throw new HttpError(401, 'Not authorized');
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
});
