const sequelize = require("../config/db");



exports.saveMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text, sender_type, receiver_type,room } = req.body;

  try {
    // Raw SQL query for inserting a new message
    const query = `
      INSERT INTO Messages (sender_id, receiver_id, message_text, sender_type, receiver_type,room)
      VALUES (${sender_id}, ${receiver_id}, '${message_text}', '${sender_type}', '${receiver_type}','${room}')
    `;

    // Execute the raw SQL query
    await sequelize.query(query);
    
    res.json({ message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};
exports.saveRequestMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text, sender_type, receiver_type,room,type,status,request_id } = req.body;

  try {
    // Raw SQL query for inserting a new message
    const query = `
      INSERT INTO Messages (sender_id, receiver_id, message_text, sender_type, receiver_type,room,type,status,request_id)
      VALUES (${sender_id}, ${receiver_id}, '${message_text}', '${sender_type}', '${receiver_type}','${room}','${type}','${status}',${request_id});
    `;

    // Execute the raw SQL query
    await sequelize.query(query);
    
    res.json({ message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};


exports.updateRequestMessage = async (req, res) => {
  try {
    const { request_id, status } = req.body;

    const query = `
      UPDATE Messages
      SET status = '${status}'
      WHERE request_id = ${request_id}
    `;

    await sequelize.query(query);
     
    res.status(200).json({ message: 'Request message status updated successfully' });
  } catch (error) {
    console.error('Error updating request message:', error.message);
    res.status(500).json({ error: 'Failed to update request message' });
  }
};




exports.getMessages = async (req, res) => {
    const { room } = req.query;
  
    try {
      // Raw SQL query for selecting messages between two users
      const query = `
        SELECT * FROM Messages 
        where room = '${room}'
        ORDER BY created_at ASC
      `;
  
      // Execute the raw SQL query
      const [messages] = await sequelize.query(query);
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving messages' });
    }
  };
  exports.getUserName =async(req,res)=>{
    const {user_id,user_type}=req.query;
    let query='';
   
    try {  
      
    if( user_type==="clients")
      {
      
        query=`select name from clients where client_id=${user_id};`;
        
      }
      else if(user_type="serviceproviders")
      {
        query=`SELECT CONCAT(firstName, ' ', lastName) AS name FROM serviceproviders WHERE sp_id = ${user_id};`
    }
   
    const[name]=await sequelize.query(query);
    res.json(name[0]);
  }
    catch(error)
    {
      res.status(500).json({ message: 'Error' });
    }

  }