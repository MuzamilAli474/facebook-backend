 
const mongoose =  require ('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    email:{
    type: String,
    unique: true, 
    require:true
    },
    password:{
        type:String,
        require:true
    },
    age: { 
        type:Date, 
        min: 18 },



});

module.exports = mongoose.model("User",userSchema); 





