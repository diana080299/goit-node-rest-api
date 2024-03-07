import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContacts,
  updateStatusContact,
} from '../controllers/contactsControllers.js';
import {
  validateCreateContactBody,
  validateUpdateContactBody,
  validateUpdateStatusContact,
} from '../helpers/validateBody.js';
import { isIdValid } from '../middlewares/index.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', isIdValid, getOneContact);

contactsRouter.delete('/:id', isIdValid, deleteContact);

contactsRouter.post('/', validateCreateContactBody, createContact);

contactsRouter.put(
  '/:id',
  isIdValid,
  validateUpdateContactBody,
  updateContacts
);

contactsRouter.patch(
  '/:id/favorite',
  isIdValid,
  validateUpdateStatusContact,
  updateStatusContact
);

export default contactsRouter;
