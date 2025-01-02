const sequelize = require('../config/db');

exports.createRequestMessageTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS RequestMessages (
        request_message_id INT PRIMARY KEY AUTO_INCREMENT,
        message_id INT NOT NULL,
        request_id INT DEFAULT NULL,
        price FLOAT,
        status ENUM('pending', 'accepted', 'cancelled') DEFAULT 'pending',
        FOREIGN KEY (message_id) REFERENCES Messages(message_id) ON DELETE CASCADE,
        FOREIGN KEY (request_id) REFERENCES ServiceRequests(request_id) ON DELETE CASCADE

      );
    `;
    await sequelize.query(query);
  };
  