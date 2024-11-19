const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); 
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 5000;

mongoose
  .connect("mongodb://localhost:27017/kashif-db"
, {
   
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
// mongodb connection end


app.use('/api/users' , userRoutes);

// Start the server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





