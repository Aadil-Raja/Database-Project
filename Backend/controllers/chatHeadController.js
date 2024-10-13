const sequelize = require('../config/db');

exports.createOrUpdateChatHead = async (req, res) => {
    try {
      const { client_id, sp_id, room, last_message } = req.body;
  
      const query = `
        INSERT INTO ChatHeads (room, client_id, sp_id, last_message, last_message_time)
        VALUES ('${room}', ${client_id}, ${sp_id}, '${last_message}', CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE 
          last_message = VALUES(last_message),
          last_message_time = CURRENT_TIMESTAMP;
      `;
  
      const [results] = await sequelize.query(query);
  
      console.log("Chat head created or updated successfully.");
      res.status(200).json({ message: "Chat head created or updated successfully." });
    } catch (error) {
      console.error("Error creating or updating chat head:", error.message);
      res.status(500).json({ error: "Error creating or updating chat head." });
    }
  };
  


exports.getChatHeadsForUser = async (req, res) => {
    try {
      let query;
      const { user_id, user_type } = req.query;
  
      // Modify the query to join with the serviceproviders table when the user is a client
      if (user_type === 'clients') {
        query = `
       SELECT CONCAT(sp.firstName, ' ', sp.lastName) as sp_name, ch.room,ch.sp_id
          FROM ChatHeads ch
          JOIN serviceproviders sp ON ch.sp_id = sp.sp_id
          WHERE ch.client_id = ${user_id};
        `;
      } else {
        // If the user is a service provider, join with the clients table to get client names
        query = `
          SELECT ch.client_id ,ch.room,cl.name AS client_name
          FROM ChatHeads ch
          JOIN clients cl ON ch.client_id = cl.client_id
          WHERE ch.sp_id = ${user_id};
        `;
      }
  
      const [results] = await sequelize.query(query);
      res.json(results); // Respond with the chat heads and associated names
    } catch (error) {
      console.error("Error fetching chat heads:", error.message);
      res.status(500).json({ error: "Error fetching chat heads." });
    }
  };
  