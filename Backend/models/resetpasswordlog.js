const sequelize = require('../config/db');

exports.createResetPasswordLog = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ResetPasswordLogs (user_id int,user_type varchar(255),
    resetPasswordToken VARCHAR(255), resetPasswordExpires DATETIME ,primary key(user_id,user_type)
    );`;
  await sequelize.query(query);
};

