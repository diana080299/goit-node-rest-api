import { User } from "../model/userModel.js";
import { jwtService } from "../services/jwtService.js";
import HttpError from "../helpers/HttpError.js";
import { ImageService } from "../services/imageService.js";
import { sendEmail } from "../services/emailService.js";

export const signup = async (userData) => {
  const user = await User.create({
    ...userData,
  });
  await user.hashPassword();
  await user.hashEmail();
  await user.save();
  const token = jwtService.signToken(user.id);

  const newUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  return newUser;
};

export const verify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: true,
  });
};
export const resendEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verifyEmail = {
    to: user.email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}" >Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
};
export const checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);
  return userExists;
};
export const updateUserToken = (id, body) => User.findByIdAndUpdate(id, body);
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw HttpError(401, "Email or password is wrong");
  if (!user.verify) throw HttpError(404, "User not found");
  const isPasswordValid = await user.checkPassword(password, user.password);

  if (!isPasswordValid) throw HttpError(401, "Email or password is wrong..");
  const token = jwtService.signToken(user._id);
  user.token = token;
  await user.save();
  return user;
};
export const getUserById = (id) => User.findById(id);

export const logout = async (token) => {
  if (!token) {
    throw HttpError(401, "Not authorized 6");
  }
  const userId = jwtService.checkToken(token);

  if (!userId) throw HttpError(401, "Not authorized 7 ");

  const currentUser = await getUserById(userId);

  if (!currentUser) throw HttpError(401, "Not authorized 8");

  currentUser.token = null;
  console.log(currentUser);
  await currentUser.save();
  console.log(currentUser.save());
  return;
};
export const updateMe = async (userData, user, file) => {
  if (!file) throw HttpError(400, "Please, add the file");
  else {
    user.avatarURL = await ImageService.saveImage(
      file,
      {
        maxFileSize: 2 * 1024,
        width: 250,
        height: 250,
      },
      user,
      "public",
      "avatars"
    );
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

export * as userService from "./userService.js";