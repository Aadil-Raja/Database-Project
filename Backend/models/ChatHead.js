const sequelize = require('../config/db');

exports.createChatHeadTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ChatHeads (
        room VARCHAR(255) PRIMARY KEY,  -- Store room identifier as the primary key
        client_id INT ,
        sp_id INT ,
        last_message TEXT,  -- Store the last message content
        last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY (client_id, sp_id),  -- Ensure unique conversations
        FOREIGN KEY (client_id) REFERENCES clients(client_id) on delete set null ,  
        FOREIGN KEY (sp_id) REFERENCES serviceproviders(sp_id) on delete set null 
      );
    `;
    await sequelize.query(query);
  };
  