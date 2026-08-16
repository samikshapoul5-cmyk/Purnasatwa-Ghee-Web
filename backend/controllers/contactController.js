const Contact = require("../models/Contact");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      message: "Contact submitted successfully",
      contactId: contact._id
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};