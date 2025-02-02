const sequelize = require('../config/db'); 

exports.getcompletedOrders = async (req, res) => {
  try {
    const { sp_id } = req.params;
    const { month, year } = req.query;

    // Use provided month and year or default to current month and year
    const queryMonth = month || new Date().getMonth() + 1;
    const queryYear = year || new Date().getFullYear();

    const query = `
      SELECT 
        (SELECT name FROM clients c WHERE c.client_id = sr.client_id) AS client_name,
        sr.completed_date AS completed_date,
        sr.price AS price,
        (SELECT name FROM cities c WHERE sr.city_id = c.city_id) AS city,
        s.name AS name,
        sr.address AS address,
        MONTH(sr.completed_date) as month, 
        YEAR(sr.completed_date) as year,
        MONTHNAME(sr.completed_date) as monthname
      FROM ServiceRequests sr
      JOIN Services s ON s.service_id = sr.service_id
      WHERE sr.sp_id = ${sp_id}
        AND sr.status = 'completed'
        AND MONTH(sr.completed_date) = ${queryMonth}
        AND YEAR(sr.completed_date) = ${queryYear}
    `;

    const [result] = await sequelize.query(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
    try {
      
 
      const{ sp_id} =req.params ;
      const query = `
        select CONCAT(sp.firstName, ' ', sp.lastName) as fullname, sp.email, sp.phone, sp.address, 
             c.name AS city
        FROM ServiceProviders sp
        JOIN Cities c ON sp.city_id = c.city_id
        WHERE sp.sp_id = ${sp_id};
      `;
  
      const [results] = await sequelize.query(query);
  
    res.json(results[0]);
     
    } catch (error) {
      console.error('Error fetching service provider profile:', error.message);
      res.json({ message: 'Failed to fetch profile' });
    }
  };



// exports.generateMonthlyInvoices=async () =>
// {
//   try{

//     const query=`CALL sp_generateMonthlyInvoices();`
//     await sequelize.query(query);
//     console.log('Monthly invoices generated successfully.');
//   }
//   catch (error) {
//         console.error('Error generating monthly invoices:', error);
//        }
// }
exports.generateMonthlyInvoices = async () => {
  try {

    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const billingMonth = date.getMonth() + 1; 
    const billingYear = date.getFullYear();
 const query=`SELECT sp_id FROM ServiceProviders;`
 
    const [serviceProviders] = await sequelize.query(query);


    for (const sp of serviceProviders) {
      const spId = sp.sp_id;

        const query1=`SELECT payment_id 
         FROM Payments 
         WHERE sp_id = ${spId} 
         AND billing_month = ${billingMonth} 
         AND billing_year = ${billingYear};`
      const [existingInvoice] = await sequelize.query(query1);
   

      if (existingInvoice.length === 0) {
        const query2=`SELECT SUM(price) AS total_earnings
           FROM ServiceRequests
           WHERE sp_id = ${spId}
             AND status = 'completed'
             AND MONTH(completed_date) = ${billingMonth}
             AND YEAR(completed_date) = ${billingYear};`
        const [totalEarningsResult] = await sequelize.query(query2);

        let totalEarnings = totalEarningsResult[0]?.total_earnings || 0;
        totalEarnings = parseFloat(totalEarnings);
        if (totalEarnings > 0) {

          const percentageFee = 10;
          let amountDue = (percentageFee * totalEarnings) / 100;
          amountDue=parseFloat(amountDue);
          const dueDate = new Date();
          dueDate.setDate(15);
          const dueDateFormatted = dueDate.toISOString().split('T')[0]; // Format due date to YYYY-MM-DD
         const query3=`INSERT INTO Payments 
             (sp_id, billing_month, billing_year, total_earnings, amount_due, due_date) 
             VALUES 
             (${spId}, ${billingMonth}, ${billingYear}, ${totalEarnings.toFixed(2)}, ${amountDue.toFixed(2)}, '${dueDateFormatted}');`
          await sequelize.query(query3);
        }
      }
    }

    console.log('Monthly invoices generated successfully.');
  } catch (error) {
    console.error('Error generating monthly invoices:', error);
  }
};


exports.getInvoices = async (req, res) => {
    try {
      const spId = req.params.sp_id;
      const query=`SELECT * 
         FROM Payments 
         WHERE sp_id = ${spId} 
         ORDER BY billing_year DESC, billing_month DESC`
      const [invoices] = await sequelize.query(query);
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  exports.getInvoiceDetails = async (req, res) => {
    try {
      const { payment_id } = req.params;
  
       const query=`SELECT * 
         FROM Payments 
         WHERE payment_id = ${payment_id};`
      const [invoice] = await sequelize.query(query);
  
      if (invoice.length === 0) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      const { sp_id, billing_month, billing_year } = invoice[0];
  
     const query2=`SELECT 
          (SELECT name FROM Clients c WHERE c.client_id = sr.client_id) AS client_name,
          sr.completed_date AS completed_date,
          sr.price AS price,
          (SELECT name FROM Cities c WHERE sr.city_id = c.city_id) AS city,
          s.name AS service_name,
          sr.address AS address,
          MONTH(sr.completed_date) as month, 
          YEAR(sr.completed_date) as year,
          MONTHNAME(sr.completed_date) as monthname
         FROM ServiceRequests sr
         JOIN Services s ON sr.service_id = s.service_id
         WHERE sr.sp_id = ${sp_id}
           AND sr.status = 'completed'
           AND MONTH(sr.completed_date) = ${billing_month}
           AND YEAR(sr.completed_date) = ${billing_year};`
      const [orders] = await sequelize.query(query2);
  
    
  
      res.status(200).json({ ...invoice[0], orders });
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


  exports.uploadProofOfPayment = async (req, res) => {
    try {
    
      const { payment_id,sp_id } = req.body;
      
  
      newFileName = `${payment_id}_${sp_id}`;
  
    
      const updateQuery = `
        UPDATE Payments
        set
            payment_date = NOW(),
            proof_of_payment = '${newFileName}'
        WHERE payment_id = ${payment_id};
      `;
  
      // Execute the raw SQL update query
      await sequelize.query(updateQuery);
  
      res.status(200).json({ message: 'Proof of payment uploaded successfully' });
    } catch (error) {
      console.error('Error uploading proof of payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.updatePaymentStatus = async(req,res)=>
  {
    try {
       const{id}= req.params;
       const query=`update Payments set status='Paid' where payment_id=${id};`;
       await sequelize.query(query);
    }
    catch(error)
    {
        console.error('Error uploading proof of payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };