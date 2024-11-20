const express = require('express');




 
const cors = require('cors')
const mongoose = require('mongoose');

const dbconnection = require('./dbconnection/dbconnection.js');


 dbconnection();

 const app=express();
 
 app.use(cors())
app.use(express.json());



app.use('/',require('./routers/userRouter.js'))

app.use('/',require('./routers/postRouter')) 




const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)
});
