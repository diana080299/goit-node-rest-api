import { userService } from "../services/userService.js";
import { catchAsync } from "../helpers/catchAsync.js";
import gravatar from "gravatar";
import { v4 } from "uuid";
import { sendEmail } from "../services/emailService.js";

export const signup = catchAsync(async (req, res) => {
  const { email } = req.body;
  const userExists = await userService.checkUserExists({ email });

  if (userExists) {
    return res.status(409).json({
      message: "Email in use",
    });
  }
  const avatar = gravatar.url(email);
  const verificationToken = v4();

  const newUser = await userService.signup({
    ...req.body,
    avatar,
    verificationToken,
  });
  
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}" >Click to verify your email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  await userService.verify(verificationToken);

  res.status(200).json({
    message: "Verification successful",
  });
});
export const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  await userService.resendEmail(email);

  res.status(200).json({
    message: "Verification email sent",
  });
});
export const login = catchAsync(async (req, res) => {
  const user = await userService.login(req.body);

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    },
    token: user.token,
  });
});
export const logout = catchAsync(async (req, res) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];
  console.log(token);
  await userService.logout(token);
  res.status(204).send();
});


export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (er) {
    console.error(er);
  }
};

export const updateMe = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateMe(req.body, req.user, req.file);

  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});