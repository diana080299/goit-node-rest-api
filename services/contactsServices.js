import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.join('db', 'contacts.json');

export const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);

    return JSON.parse(data.toString());
  } catch (error) {}
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const results = contacts.find((item) => item.id === contactId);
    return results || null;
  } catch (error) {}
};

export const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const removedContactIndex = contacts.findIndex(
      (item) => item.id === contactId
    );

    if (removedContactIndex === -1) {
      return null;
    }
    const [removedContact] = contacts.splice(removedContactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {}
};

export const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {}
};

export const updateContact = async (id, data) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
      return null;
    }

    const updatedContact = { ...contacts[index], ...data };
    contacts[index] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};
