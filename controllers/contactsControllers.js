import * as contactsServices from '../services/contactsServices.js';
import { catchAsync } from '../helpers/catchAsync.js';

export const getAllContacts = catchAsync(async (req, res) => {
  const ownerId = req.user.id;
  const contacts = await contactsServices.getContactsList(ownerId);
  res.status(200).json(contacts);
});

export const getOneContact = catchAsync(async (req, res) => {
  const ownerId = req.user.id;
  const contactById = await contactsServices.getContactById(
    req.params.id,
    ownerId
  );
  if (!contactById) {
    return res.status(404).json({
      msg: 'Not found..',
    });
  } else {
    res.status(200).json(contactById);
  }
});

export const deleteContact = catchAsync(async (req, res) => {
  const ownerId = req.user.id;
  const removedContact = await contactsServices.removeContact(
    req.params.id,
    ownerId
  );
  if (!removedContact) {
    return res.status(404).json({
      message: 'Not found',
    });
  }
  res.status(200).json(removedContact);
});

export const createContact = catchAsync(async (req, res) => {
  const contact = await contactsServices.checkContactExists({
    email: req.body.email,
  });
  if (!contact) {
    const ownerId = req.user.id;
    const newContact = await contactsServices.addContact(req.body, ownerId);

    res.status(201).json(newContact);
  }
});

export const updateContacts = catchAsync(async (req, res) => {
  const ownerId = req.user.id;
  const updatedContact = await contactsServices.updateContact(
    req.params.id,
    ownerId,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedContact) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: 'Body must have at least one field' });
  }
  res.status(200).json(updatedContact);
});

export const updateStatusContact = catchAsync(async (req, res) => {
  const { favorite } = req.body;
  const ownerId = req.user.id;
  const result = await contactsServices.updateStatusContact(
    req.params.id,
    ownerId,
    { favorite },
    { new: true }
  );
  if (!result) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  res.status(200).json(result);
});
