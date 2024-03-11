import { model, Schema } from 'mongoose';
import { compare } from 'bcrypt';
import bcrypt from 'bcryptjs';
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);
userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};
userSchema.methods.checkPassword = (candidate, passwordHash) =>
  compare(candidate, passwordHash);
const User = model('user', userSchema, 'users');

export { User };
