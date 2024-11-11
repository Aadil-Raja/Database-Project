
const sequelize = require('../config/db');

exports.createfeedbackTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Feedback (
  request_id INT PRIMARY KEY,                   -- Primary key (one feedback per request)
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES servicerequests(request_id) on delete cascade
);

  `;
  await sequelize.query(query);
};

