const Client = require('../models/client');
const Sp =require('../models/Sp');
const sequelize =require('../config/db');
const crypto = require('crypto');
require('dotenv').config()
const cors = require('cors');
const nodemailer = require('nodemailer');


exports.forgotPassword = async(req,res) =>{
    const {email} =req.body;
    try{
    const checkEmailInSp = `SELECT * FROM ServiceProviders WHERE email = '${email}'`;
    const [spUser] = await sequelize.query(checkEmailInSp);

    
    const checkEmailInClient = `SELECT * FROM Clients WHERE email = '${email}'`;
    const [clientUser] = await sequelize.query(checkEmailInClient);
    if (spUser.length  == 0 && clientUser.length == 0) {
        return res.json({ message: "Email not found" });

      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetPasswordExpires = Date.now() + 15 * 60 * 1000;
      let table_name="";
      if(spUser.length>0)
      {
             table_name="ServiceProviders";
      }
      else
      {
        table_name="Clients";
      }
      const query = `
  UPDATE ${table_name}
  SET resetPasswordToken = '${resetToken}', 
      resetPasswordExpires = NOW() + INTERVAL 15 MINUTE 
  WHERE email = '${email}';
`;

await sequelize.query(query);



const resetLink = `http://localhost:5173/resetPassword?token=${resetToken}&type=${table_name}`;



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
console.log("Transporter created successfully");
const mailOptions = {
    to: email,
    from: process.env.EMAIL,
    subject: 'Password Reset',
    text: `You are receiving this email because you requested a password reset for your account.\n\n
    Please click on the following link to reset your password:\n\n
    ${resetLink}\n\n
    If you did not request this, please ignore this email.\n`,
};

await transporter.sendMail(mailOptions);
res.json({ message: "Password reset link sent" });
    }
catch(error)
{
    res.status(500).json({ message: 'Server error' });
}
}