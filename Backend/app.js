const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
require('dotenv').config()
// Import the models separately
const Client = require('./models/client');
const ServiceProvider = require('./models/Sp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', require('./routes/userRoutes'));

// Sync all models with the database
sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});
app.get("/",(req,res)=>{
    res.send("Server running");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
