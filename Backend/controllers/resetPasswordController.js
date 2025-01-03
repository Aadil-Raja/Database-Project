const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

exports.resetpassword = async (req, res) => {
  const { token, password ,user_id,type} = req.body;

  if (!token  || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user by reset token using a raw SQL query
    const findUserQuery = `SELECT * FROM ResetPasswordLogs WHERE resetPasswordToken = '${token}' and  user_id=${user_id} and user_type='${type}';`;
    const [user] = await sequelize.query(findUserQuery);
    

    // Check if the user exists and if the reset token has expired
    if (!user.length || new Date(user[0].resetPasswordExpires) < Date.now()) {
      return res.json({ message: "Token is invalid or has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    let updateUserQuery;
    // Update the password and clear the reset token and its expiration
    if(type==='serviceproviders')
    {
      updateUserQuery= `
      UPDATE ServiceProviders
      SET password = '${hashedPassword}'
      WHERE sp_id = ${user_id};
    `;

    }
    else
    {
      updateUserQuery= `
      UPDATE Clients
      SET password = '${hashedPassword}'
      WHERE client_id = ${user_id};
    `;
    }
   

    // Execute the update query
    await sequelize.query(updateUserQuery);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteExpiredTokens = async () => {

  try {
    const query = `
      DELETE FROM ResetPasswordLogs
      WHERE resetPasswordExpires < NOW();
    `;
    await sequelize.query(query);
    console.log("Expired reset password records deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired reset password records:", error);
  }
};

// exports.deleteExpiredTokens = async () => {
//   try {
//     const query = `CALL deleteExpiredTokens(); `;
//     await sequelize.query(query);
//     console.log("Expired reset password records deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting expired reset password records:", error);
//   }
// };