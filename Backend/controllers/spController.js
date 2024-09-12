// spController.js
const Sp = require("../models/Sp");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.createSp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, city, gender, dob, tips, terms } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !address || !city || !gender || !dob || terms === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Sp.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      gender,
      dob,
      tips,
      terms
    });

    res.json({
      message: "User Created Successfully",
      user: newUser
    });
  } catch (err) {
    console.error("Error in createSp:", err.message);
    res.status(500).json({ error: err.message });
  }
};

