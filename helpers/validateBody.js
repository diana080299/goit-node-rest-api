import HttpError from '../helpers/HttpError.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';
import { createUserSchema } from '../schemas/userSchemas.js';

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const validateCreateContactBody = validateBody(createContactSchema);
export const validateUpdateContactBody = validateBody(updateContactSchema);
export const validateUpdateStatusContact = validateBody(
  updateStatusContactSchema
);
export const validateCreateUserBody = validateBody(createUserSchema);
