import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContacts,
} from '../controllers/contactsControllers.js';
import { validateUpdateContactBody } from '../helpers/validateBody.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', validateUpdateContactBody, createContact);

contactsRouter.put('/:id', validateUpdateContactBody, updateContacts);

export default contactsRouter;
