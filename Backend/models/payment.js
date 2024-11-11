const sequelize = require('../config/db');

exports.createPaymentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Payments (
      payment_id INT PRIMARY KEY AUTO_INCREMENT,             
      sp_id INT,                                             
      billing_month INT,                                    
      billing_year INT,                                      
      total_earnings DECIMAL(10, 2),                       
      amount_due DECIMAL(10, 2),                             
      status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',  -- Payment status
      due_date DATE,                                         
      payment_date DATE,                              
      proof_of_payment VARCHAR(255),                       
      FOREIGN KEY (sp_id) REFERENCES serviceproviders(sp_id) on delete set null
    );
  `;
  await sequelize.query(query);
};
