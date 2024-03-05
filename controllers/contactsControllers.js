import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from '../services/contactsServices.js';
import { createContactSchema } from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();

  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contactById = await getContactById(id);

  if (contactById) {
    res.status(200).json(contactById);
  } else {
    return res.status(404).json({
      message: 'Not found',
    });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await removeContact(id);

  if (contact != null) {
    res.status(200).json(contact);
  } else {
    return res.status(404).json({
      message: 'Not found',
    });
  }
};

export const createContact = async (req, res) => {
  const { value, error } = createContactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  const newContact = await addContact(value);

  res.status(201).json(newContact);
};

export const updateContacts = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedContact = await updateContact(id, req.body);
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: 'Body must have at least one field' });
    }
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
