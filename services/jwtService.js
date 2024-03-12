import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import dotenv from 'dotenv';
dotenv.config();

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
};

export const checkToken = (token) => {
  if (!token) throw HttpError(401, 'Not authorized in..');

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id;
  } catch (error) {
    throw HttpError(401, 'Not authorized');
  }
};

export * as jwtService from './jwtService.js';
