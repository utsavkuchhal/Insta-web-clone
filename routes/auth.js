const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/key");
const requireLogin = require("../middleware/requireLogin");
const saltRounds = 10;


router.get("/",function(req,res){
    res.send("hello This is from other route");
});

router.get('/protected',requireLogin,function(req, res){
    res.send("hello users");
});

router.post("/signup", function(req,res){
   const{name, email, password, pic} = req.body;
   if(!email || !name || !password){
       return res.status(422).json({error : "please add all the fields"});
   }else{
       User.findOne({email : email},function(err ,SavedUser){
           if(!err){
               if(SavedUser){
                return res.status(422).json({error : "User already exists"});
               }

               bcrypt.hash(password, saltRounds, function(err, hash) {
                const user = new User({
                    email : email,
                    password : hash,
                    name : name,
                    pic
                })
 
                user.save(function(err){
                    if(!err)
                    res.json({message : "saved Succesfully"});
                    else
                    console.log(err);
                });
            });

           }else{
               console.log(err);
           }
       })
   }
});

router.post("/signin", function(req,res){
    const {email ,password} = req.body;

    if(!email || ! password){
        return res.status(422).json({error : "Please add all fields"});
    }

    User.findOne({email : email}, function(err , foundUser){
        if(!err){
            if(!foundUser){
                return res.status(422).json({error : "Please enter valid email and password"}); 
            }

            bcrypt.compare(password, foundUser.password, function(err, result) {
              if(!err){
                  if(result){
                      const {_id, name, email,followers, following,pic} = foundUser;
                      const token = jwt.sign({_id : foundUser._id},JWT_SECRET);
                      res.json({token, user:{ _id, name, email,followers,following,pic}});
                    //   res.json({message : "User SignedIn"});
                  }
                  else
                  res.status(422).json({error : "Please enter valid email and password"}); 
              }
            });
        }else{
            console.log(err);
        }
    });
})

module.exports = router;