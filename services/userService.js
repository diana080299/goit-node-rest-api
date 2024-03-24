import { User } from '../model/userModel.js';
import { jwtService } from '../services/jwtService.js';
import HttpError from '../helpers/HttpError.js';
import { ImageService } from '../services/imageService.js';
import path from 'path';

export const signup = async (userData) => {
  const user = await User.create({
    ...userData,
  });
  await user.hashPassword();
  await user.hashEmail();
  await user.save();

  return newUser;
};

export const checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);
  return userExists;
};

export const updateUserToken = (id, body) => User.findByIdAndUpdate(id, body);
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw HttpError(401, 'Email or password is wrong');

  const isPasswordValid = await user.checkPassword(password, user.password);

  if (!isPasswordValid) throw HttpError(401, 'Email or password is wrong..');

  return user;
};
export const getUserById = (id) => User.findById(id);

export const logout = async (token) => {
  if (!token) {
    throw new HttpError(401, 'Not authorized');
  }
  const userId = jwtService.checkToken(token);

  if (!userId) throw HttpError(401, 'Not authorized');

  const currentUser = await getUserById(userId);

  if (!currentUser) throw HttpError(401, 'Not authorized');

  currentUser.token = null;
  await currentUser.save();
  return;
};

export const updateMe = async (userData, user, file) => {
  if (!file) throw HttpError(400, 'Please, add the file');
  else {
    user.avatarURL = await ImageService.saveImage(
      file,
      {
        maxFileSize: 2 * 1024,
        width: 250,
        height: 250,
      },
      user,
      'public',
      'avatars'
    );
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

export * as userService from './userService.js';
