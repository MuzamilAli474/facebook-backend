const userModel = require("../models/userModel");
const postModel = require("../models/PostCreateModel");


const postCreate = (req , res)=>{
    const { title, content } = req.body;
    let userEmail = req.user.email;
    const imagePath= req.file ?req.file.path : null;
    userModel
      .findOne({ email: userEmail })
      .then((user) => {
        if (user) {
          postModel.create({
              title: title,
              content: content,
              createdBy: user._id,
              image : imagePath,
  
            })
            .then(() => {
              return res.status(200).json({
                message: "posts created successfully",
              });
            })
            .catch((err) => {
              return res.status(400).json({
                message: "posts create error" + err,
              });
            });
        } else {
          return res.status(400).json({
            message: "user not found",
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "error " + err,
        });
      });
  };
  // post create ended

 //  user posts show start 
 const showData = (req , res)=>{
    const userEmail = req.user.email;
    userModel
    .findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      postModel
        .find({ createdBy: user._id })
        .then((postData) => {
          return res.status(200).json({ postData });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Error fetching posts",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    });
  }
 //  user posts show end

  //  user posts show start 
  const allPosts = (req , res)=>{
    const userEmail = req.user.email;
    userModel
    .findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      postModel
        .find()
        .then((postData) => {
          return res.status(200).json({ postData });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Error fetching posts",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    });
  }
 //  user posts show end

module.exports = {postCreate , showData ,allPosts}