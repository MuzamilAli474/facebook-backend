const express = require('express');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

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
app.use('/api/users' , postRoutes);

// Start the server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





