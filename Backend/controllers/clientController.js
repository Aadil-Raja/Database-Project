// clientController.js
const Client = require("../models/client");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.createClient = async (req, res) => {
  try {
    const { firstName, lastName, email, password, tips, terms } = req.body;
    if (!firstName || !lastName || !email || !password || terms === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Client.create({ firstName, lastName, email, password: hashedPassword, tips, terms });
    
    res.json({
      message: "User Created Successfully",
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

