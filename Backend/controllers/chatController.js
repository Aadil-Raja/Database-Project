const sequelize = require("../config/db");



exports.saveMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text, sender_type, receiver_type,room } = req.body;

  try {
   
    const query = `
      INSERT INTO Messages (sender_id, receiver_id, message_text, sender_type, receiver_type,room)
      VALUES (${sender_id}, ${receiver_id}, '${message_text}', '${sender_type}', '${receiver_type}','${room}')
    `;

    
    await sequelize.query(query);
    
    res.json({ message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};
exports.saveRequestMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text, sender_type, receiver_type,room,type,status,request_id ,price} = req.body;

  try {
   
    const query = `
      INSERT INTO Messages (sender_id, receiver_id, message_text, sender_type, receiver_type,room,type)
      VALUES (${sender_id}, ${receiver_id}, '${message_text}', '${sender_type}', '${receiver_type}','${room}','${type}');
    `;

    const [result] = await sequelize.query(query);

    const messageId = result;

      const requestMessageQuery = `
        INSERT INTO RequestMessages (message_id, request_id, price, status)
        VALUES (${messageId}, ${request_id}, ${price}, '${status}');
      `;
      await sequelize.query(requestMessageQuery);
    
    res.json({ message: 'Message saved successfully' });w
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error saving message' });
    }

  }
};


exports.updateRequestMessage = async (req, res) => {
  try {
    const { request_id, status,room } = req.body;
     let query;


      query = `
      UPDATE requestmessages rm
      join messages m on rm.message_id=m.message_id
      SET rm.status = '${status}'
      WHERE rm.request_id = ${request_id} and m.room='${room}' and rm.status='pending'
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
    
      const query = `
        SELECT * FROM messages m
        left join requestmessages rm on rm.message_id=m.message_id
        where m.room = '${room}'
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