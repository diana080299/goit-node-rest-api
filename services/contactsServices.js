const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const readJson = await fs.readFile(contactsPath);
  return JSON.parse(readJson);
}

async function getContactById(contactId) {
  const arr = await listContacts();
  const resp = arr.find((el) => el.id === contactId);
  return resp || null;
}

async function removeContact(contactId) {
  const arr = await listContacts();
  const index = arr.findIndex((el) => el.id === contactId);
  if (index === -1) return null;

  const deleteEl = arr.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(arr, null, 2));
  return deleteEl[0];
}

async function addContact(name, email, phone) {
  const arr = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  arr.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(arr, null, 2));
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
