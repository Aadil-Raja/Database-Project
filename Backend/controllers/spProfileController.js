const sequelize = require('../config/db'); // Assuming you have a sequelize instance

exports.getProfile = async (req, res) => {
  try {
    
    // Assuming req.user is populated by middleware with decoded JWT data
    const sp_id = req.user.id;

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


exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city_id, gender, dob } = req.body;
    const service_provider_id = req.user.id; // Extract service provider ID from token

    // Update query
    const query = `
      UPDATE ServiceProviders
      SET 
        firstName = '${firstName}', 
        lastName = '${lastName}', 
        email = '${email}',
        phone = '${phone}', 
        address = '${address}', 
        city_id = ${city_id},
        gender = '${gender}', 
        dob = '${dob}'
      WHERE sp_id = ${service_provider_id};
    `;

    // Execute the query
    await sequelize.query(query);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.getServices =async(req,res) => {
  try {
    const service_provider_id = req.user.id; // Extract service provider ID from token

    const query = `
      SELECT 
       
        sps.service_provider_id, 
        sps.service_id, 
        sps.availability_status, 
        srv.name AS service_name, 
        cat.name AS category_name
      FROM 
        ServiceProviderServices sps
      JOIN 
        Services srv ON sps.service_id = srv.service_id
      JOIN 
        Categories cat ON srv.category_id = cat.category_id
      WHERE 
        sps.service_provider_id = ${service_provider_id};
    `;

    const [services] = await sequelize.query(query);
    console.log(services);
    res.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }

}

exports.removeService=async(req,res) => {
  try{
         const{service_id}=req.params;
         const service_provider_id = req.user.id; 
         const query =`DELETE FROM serviceproviderservices 
         where service_Id=${service_id} and service_provider_Id= ${service_provider_id} `
         await sequelize.query(query);
         res.json({message:"deleted successfully"});
  }
  catch(error)
  {
    console.error("Error deleting a service",error);
  }
};


exports.updateAvailability = async (req, res) => {
  try {
    
        const { service_id } = req.params;
    const service_provider_id = req.user.id;
    const { available } = req.body; 
   
    const query = `
      UPDATE serviceproviderservices
      SET availability_status = ${available}
      WHERE service_id = ${service_id} AND service_provider_id = ${service_provider_id
      }
    `;


    await sequelize.query(query);
    res.json({ message: "Service availability updated successfully" });
  } catch (error) {
    console.error("Error updating service availability", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
};

exports.getEmail =async(req,res)=>{
  try {
    const {sp_id}=req.query;
    const query=`select email from serviceproviders where sp_id=${sp_id}`;
   const [result]= await sequelize.query(query);
    res.json(result[0])
  }
  catch(error)
  {
    console.error( error);
  }
}