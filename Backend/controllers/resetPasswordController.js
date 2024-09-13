const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

exports.resetpassword = async (req, res) => {
  const { token, type, password } = req.body;

  if (!token || !type || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user by reset token using a raw SQL query
    const findUserQuery = `SELECT * FROM ${type} WHERE resetPasswordToken = '${token}' LIMIT 1;`;
    const [user] = await sequelize.query(findUserQuery);

    // Check if the user exists and if the reset token has expired
    if (!user.length || user[0].resetPasswordExpires < Date.now()) {
      return res.json({ message: "Token is invalid or has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password and clear the reset token and its expiration
    const updateUserQuery = `
      UPDATE ${type} 
      SET password = '${hashedPassword}', resetPasswordToken = NULL, resetPasswordExpires = NULL
      WHERE resetPasswordToken = '${token}';
    `;

    // Execute the update query
    await sequelize.query(updateUserQuery);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
