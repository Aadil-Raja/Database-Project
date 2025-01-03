const sequelize = require('../config/db');
const jwt = require('jsonwebtoken');

// Controller to add a new category and return all categories
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Successful", token });
  } else {
    res.json({ message: "Unsuccessful" });
  }
};

exports.addReqCategory = async (req, res) => {
  const { title, description } = req.body;
  const spId = req.user.id;

  try {
    if (title && spId) {
      const insertQuery = `
        INSERT INTO RequestCategories (spId, title, description)
        VALUES (${spId}, '${title}', '${description}')
      `;
      await sequelize.query(insertQuery);
    }
    res.json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error handling category request:', error);
    res.status(500).json({ error: 'Failed to process category request.' });
  }
};

// Controller to fetch all categories with the service provider's name
exports.getReqCategories = async (req, res) => {
  try {
    const fetchQuery = `
      SELECT rc.*, CONCAT(sp.firstName, ' ', sp.lastName) as fullName
      FROM RequestCategories rc
      JOIN ServiceProviders sp ON rc.spId = sp.spId;
    `;
    const [categories] = await sequelize.query(fetchQuery);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories with service provider names:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.removeReqCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM RequestCategories WHERE id = ${id}`;
    await sequelize.query(query);
    res.json({ message: "Successful" });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const fetchQuery = `
      SELECT p.*, CONCAT(sp.firstName, ' ', sp.lastName) as fullName
      FROM Payments p
      JOIN ServiceProviders sp ON p.spId = sp.spId
      WHERE p.status = 'Pending' AND p.proofOfPayment IS NOT NULL;
    `;
    const [payments] = await sequelize.query(fetchQuery);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

exports.updateCategoryStatus = async (req, res) => {
  const { status } = req.body;
  const { categoryId } = req.params;
  try {
    const query = `UPDATE Categories SET status = '${status}' WHERE categoryId = ${categoryId}`;
    await sequelize.query(query);
    res.json({ message: "Successful" });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

exports.updateServiceStatus = async (req, res) => {
  const { status } = req.body;
  const { serviceId } = req.params;
  try {
    const query = `UPDATE Services SET status = '${status}' WHERE serviceId = ${serviceId}`;
    await sequelize.query(query);
    res.json({ message: "Successful" });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};
