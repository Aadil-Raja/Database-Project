const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sequelize = require("../config/db"); // Assuming sequelize is used for querying

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check ServiceProvider
        const spQuery = `SELECT * FROM ServiceProviders WHERE email = '${email}'`;
        const [spResults] = await sequelize.query(spQuery);
        const spUser = spResults[0];

        if (spUser) {
            const passwordMatch = await bcrypt.compare(password, spUser.password);
            if (passwordMatch) {
                console.log(`Login successful for ServiceProvider: ${email}`);
                console.log(spUser.sp_id, spUser.email);
                const token = jwt.sign({ id: spUser.sp_id, email: spUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                let first_time_login = null;
                if (spUser.first_time_login === 1) { // 1 for true in SQL
                    first_time_login = "First time login";
                    
                    // Update first_time_login to false in the database
                    const FirstTimeLogin = `
                      UPDATE ServiceProviders 
                      SET first_time_login = 0 
                      WHERE sp_id = ${spUser.sp_id}
                    `;
                    await sequelize.query(FirstTimeLogin);
                }

                return res.json({ message: "exist", token, role: "servicesproviders", first_time_login });
            } else {
                return res.json({ message: "Invalid password" });
            }
        }

        // Check Client
        const clientQuery = `SELECT * FROM Clients WHERE email = '${email}'`;
        const [clientResults] = await sequelize.query(clientQuery);
        const clientUser = clientResults[0];

        if (clientUser) {
            const passwordMatch = await bcrypt.compare(password, clientUser.password);
            if (passwordMatch) {
                console.log(`Login successful for Client: ${email}`);
                const token = jwt.sign({ id: clientUser.client_id, email: clientUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ message: "exist", token, role: "clients" });
            } else {
                return res.json({ message: "Invalid password" });
            }
        }

        return res.json("notexist");
    } catch (e) {
        console.error('Login error:', e.message);
        res.status(500).json("fail");
    }
};
