const sequelize = require('../config/db');

exports.createChatHeadTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ChatHeads (
        room VARCHAR(255) PRIMARY KEY,  -- Store room identifier as the primary key
        client_id INT NOT NULL,
        sp_id INT NOT NULL,
        last_message TEXT,  -- Store the last message content
        last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY (client_id, sp_id),  -- Ensure unique conversations
        FOREIGN KEY (client_id) REFERENCES clients(client_id),  -- Reference to clients table
        FOREIGN KEY (sp_id) REFERENCES serviceproviders(sp_id)  -- Reference to serviceproviders table
      );
    `;
    await sequelize.query(query);
  };
  