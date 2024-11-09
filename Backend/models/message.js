const sequelize = require('../config/db');

exports.createMessageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  message_text TEXT NOT NULL,
  sender_id INT NOT NULL,      
  receiver_id INT NOT NULL,      
  sender_type ENUM('clients', 'serviceproviders') NOT NULL, 
  receiver_type ENUM('clients', 'serviceproviders') NOT NULL,
  room varchar(255),
  request_id INT Default NULL,
   price FLOAT,
  type ENUM('regular', 'service_request') DEFAULT 'regular',
  status ENUM('pending', 'accepted', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  
  `;
  await sequelize.query(query);
};

