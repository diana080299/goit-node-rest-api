import { Contact } from '../model/contact.js';

import HttpError from '../helpers/HttpError.js';

export const getContactsList = async (ownerId) => {
  const contacts = await Contact.find({ owner: ownerId });
  return contacts;
};

export const getContactById = (id, ownerId) =>
  Contact.findOne({ _id: id, owner: ownerId });

export const removeContact = (id, ownerId) =>
  Contact.findOneAndDelete({ _id: id, owner: ownerId });

export const addContact = (body, ownerId) => {
  body.owner = ownerId;
  return Contact.create(body);
};

export const updateContact = (id, ownerId, body) =>
  Contact.findOneAndUpdate({ _id: id, owner: ownerId }, body, { new: true });

export const updateStatusContact = (id, ownerId, body) =>
  Contact.findOneAndUpdate({ _id: id, owner: ownerId }, body, { new: true });

export const checkContactExists = async (filter, throwError = true) => {
  const contactExists = await Contact.exists(filter);
  if (contactExists && throwError) {
    throw HttpError(409, 'User already exists..');
  }
  return contactExists;
};
export * as ContactsService from './contactsServices.js';
