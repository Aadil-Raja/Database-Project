
const sequelize = require('../config/db'); // Assuming you have a sequelize instance

exports.getProfile = async (req, res) => {
    try {
      
    const {sp_id}=req.query;
  
      // Query to fetch the service provider's profile with city name
      const query = `
        SELECT sp.sp_id, sp.firstName, sp.lastName, sp.email, sp.phone, sp.address, 
               sp.gender, sp.dob, sp.role, sp.status, c.name AS city_name,sp.city_id as city_id
        FROM ServiceProviders sp
        JOIN Cities c ON sp.city_id = c.city_id
        WHERE sp.sp_id = ${sp_id};
      `;
  
      const [results] = await sequelize.query(query);
  
      if (results.length === 0) {
        return res.json({ message: 'Service provider not found' });
      }
  
      // Sending the service provider's data with city name as response
      const spUser = results[0]; // Extracting the first result
       console.log(results[0]);
      res.json({
        firstName: spUser.firstName,
        lastName: spUser.lastName,
        email: spUser.email,
        phone: spUser.phone,
        address: spUser.address,
        city_name: spUser.city_name,
        city_id :spUser.city_id,  // Now this contains the city name
        gender: spUser.gender,
        dob: spUser.dob,
        role: spUser.role,
        status: spUser.status,
      });
    } catch (error) {
      console.error('Error fetching service provider profile:', error.message);
      res.json({ message: 'Failed to fetch profile' });
    }
  };



  exports.getServices =async(req,res) => {
    try {
      const {sp_id}= req.query; // Extract service provider ID from token
  
      const query = `
      SELECT 
   
        sps.service_id, 

        srv.name AS service_name, 
        cat.name AS category_name
      FROM 
        ServiceProviderServices sps
      JOIN 
        Services srv ON sps.service_id = srv.service_id
      JOIN 
        Categories cat ON srv.category_id = cat.category_id
      WHERE 
        sps.service_provider_id = ${sp_id};
    `;
  
      const [services] = await sequelize.query(query);
      console.log(services);
      res.json({ services });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  
  }



  
exports.getfeedback= async (req,res) => {

    try {
        const {sp_id}=req.query;
        const query =`SELECT 
       f.rating as rating,f.review as review,f.created_at as review_date
      ,s.name as name
        from servicerequests sr join services s on  s.service_id = sr.service_id
         LEFT JOIN Feedback f ON sr.request_id = f.request_id
      
        where sp_id=${sp_id} and sr.status='completed' 
        order by sr.request_date desc`;
        const[result]=await sequelize.query(query);
        res.json(result);
    }
    catch(error)
    {
        
      
      res.status(500).json({ error: error.message });
    
    }
  }