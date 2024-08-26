const express = require('express');
const sequelize = require('./config/db');
const User = require('./models/user');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user',require("./routes/userRoutes"));
// Sync all models with the database
sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
