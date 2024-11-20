const mongoose = require('mongoose')


const dbconnection = async ()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/Facebook',{

        })
        console.log('database connected successfully!');
    } catch (error) {
        console.log('db connection failed');
    }
}


module.exports = dbconnection;