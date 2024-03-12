import { User } from '../model/userModel.js';
import { jwtService } from './jwtService.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcrypt';

export const signup = async (userData) => {
  const user = await User.create({
    ...userData,
  });
  await user.hashPassword();
  await user.save();
  const token = jwtService.signToken(user.id);

  console.log(token);

  const newUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

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
  console.log('Logout request received with token:', token);

  if (!token) {
    console.log('No token provided');
    throw new HttpError(401, 'Not authorized');
  }

  const userId = jwtService.checkToken(token);
  console.log('Decoded user ID:', userId);

  if (!userId) {
    console.log('Invalid token');
    throw new HttpError(401, 'Not authorized');
  }

  const currentUser = await getUserById(userId);
  console.log('Current user:', currentUser);

  if (!currentUser) {
    console.log('User not found');
    throw new HttpError(401, 'Not authorized');
  }

  currentUser.token = null;
  await currentUser.save();
  console.log('User token set to null:', currentUser);

  return;
};

export * as userService from './userService.js';
