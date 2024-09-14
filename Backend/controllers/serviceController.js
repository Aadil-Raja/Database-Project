
const Service = require('../models/Service'); 


exports.getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; 

    
    const services = await Service.findAll({
      where: {
        category_id: categoryId,
      },
    });

    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};
