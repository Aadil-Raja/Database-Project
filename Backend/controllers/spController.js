const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

exports.createSp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, city_id, gender, dob, tips, terms } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !address || !city_id || !gender || !dob || terms === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
      
    const checkEmailInSp = `SELECT * FROM ServiceProviders WHERE email = '${email}'`;
    const [spUser] = await sequelize.query(checkEmailInSp);

    // Check if the email already exists in the Clients table
    const checkEmailInClient = `SELECT * FROM Clients WHERE email = '${email}'`;
    const [clientUser] = await sequelize.query(checkEmailInClient);

    // If email exists in either table, return an error
    if (spUser.length > 0 || clientUser.length > 0) {
      return res.json({ message: "Email already exists" });
    }
   

    // SQL query to insert a new service provider
    const insertQuery = `
      INSERT INTO ServiceProviders 
      (firstName, lastName, email, password, phone, address, city_id, gender, dob, tips, terms, createdAt, updatedAt)
      VALUES 
      ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phone}', '${address}', ${city_id}, '${gender}', '${dob}', ${tips ? 1 : 0}, ${terms ? 1 : 0}, NOW(), NOW());
    `;

    // Execute the query
    await sequelize.query(insertQuery);

    res.json({ message: "User Created Successfully" });
  } catch (err) {
    console.error("Error in createSp:", err.message);
    res.status(500).json({ error: err.message });
  }
};
