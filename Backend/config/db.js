const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sequelize_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });
async function initializeDataBase()
{try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}

initializeDataBase()
module.exports=sequelize;