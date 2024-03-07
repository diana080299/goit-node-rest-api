import { Contact } from '../model/contact.js';

import HttpError from '../helpers/HttpError.js';

export const getContactsList = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const addContact = (body) => Contact.create(body);

export const updateContact = (id, body) =>
  Contact.findByIdAndUpdate(id, body, { new: true });

export const updateStatusContact = (id, body) =>
  Contact.findByIdAndUpdate(id, body, { new: true });

export const checkContactExists = async (filter, throwError = true) => {
  const contactExists = await Contact.exists(filter);

  if (contactExists && throwError) {
    throw HttpError(409, 'User already exists..');
  }
  return contactExists;
};

export * as ContactsService from './contactsServices.js';
