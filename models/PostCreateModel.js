const mongoose = require('mongoose'); 
console.log("postmodel connected")
//   now schema for posts started
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        
      },
    content: {
        type: String,
        required: true,
        
      },
    createdBy: {
         type: mongoose.Schema.Types.ObjectId, ref: "SignUp-Users" 
        },
        
    image : {
        type : String
    }
  });
  const postModel = mongoose.model("posts", postSchema);
  
  module.exports =  postModel ;
