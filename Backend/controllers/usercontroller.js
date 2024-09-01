const Client = require("../models/client");
const Sp = require("../models/Sp");
const bcrypt = require("bcryptjs");

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
}

exports.createSp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, tips, terms } = req.body;
    if (!firstName || !lastName || !email || !password || terms === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Sp.create({ firstName, lastName, email, password: hashedPassword, tips, terms });
    
    res.json({
      message: "User Created Successfully",
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the ServiceProvider table
    const spUser = await Sp.findOne({ where: { email } });
    if (spUser) {
      const passwordMatch = await bcrypt.compare(password, spUser.password);
      if (passwordMatch) {
        console.log(`Login successful for ServiceProvider: ${email}`);
        return res.json("exist");
      }
    }

    // Check if the user exists in the Client table
    const clientUser = await Client.findOne({ where: { email } });
    if (clientUser) {
      const passwordMatch = await bcrypt.compare(password, clientUser.password);
      if (passwordMatch) {
        console.log(`Login successful for Client: ${email}`);
        return res.json("exist");
      }
    }

    console.log(`Login failed for email: ${email}`);
    return res.json("notexist");
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json("fail");
  }
};

