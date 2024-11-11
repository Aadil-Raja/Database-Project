const sequelize = require('../config/db');

exports.createRequestCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS RequestCategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sp_id INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      FOREIGN KEY (sp_id) REFERENCES ServiceProviders(sp_id)
        ON DELETE cascade
    );
  `;
  await sequelize.query(query);
};


