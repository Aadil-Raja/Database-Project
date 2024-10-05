const sequelize = require("../config/db");



exports.saveMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text, sender_type, receiver_type } = req.body;

  try {
    // Raw SQL query for inserting a new message
    const query = `
      INSERT INTO Messages (sender_id, receiver_id, message_text, sender_type, receiver_type)
      VALUES (${sender_id}, ${receiver_id}, '${message_text}', '${sender_type}', '${receiver_type}')
    `;

    // Execute the raw SQL query
    await sequelize.query(query);
    
    res.json({ message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};


exports.getMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.query;
  
    try {
      // Raw SQL query for selecting messages between two users
      const query = `
        SELECT * FROM Messages 
        WHERE 
          (sender_id = ${sender_id} AND receiver_id = ${receiver_id})
        OR 
          (sender_id = ${receiver_id} AND receiver_id = ${sender_id})
        ORDER BY created_at ASC
      `;
  
      // Execute the raw SQL query
      const [messages] = await sequelize.query(query);
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  };