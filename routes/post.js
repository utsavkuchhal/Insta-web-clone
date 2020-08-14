const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const requireLogin  = require('../middleware/requireLogin');
const Post =  mongoose.model("Post");

router.post("/createpost",requireLogin,function(req,res){
    const{title ,body, pic} = req.body;

    if(!title || !body || !pic){
        return  res.status(422).json({error:"Plase add all the fields"})
    }

    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy : req.user 
    });

    post.save().then(result => {
      res.json({post : result});  
    }).catch(err =>{
        console.log(err);
    })
});

router.get('/allposts',requireLogin,function(req,res){
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({posts : posts})
    })
    .catch(err =>{
        console.log(err);
    })
});

router.put('/like',requireLogin,function(req,res){
    Post.findByIdAndUpdate(req.body.postId ,{
        $push : {likes : req.user._id}
    },{
        new : true
    }).exec((err, result) =>{
        if(err){
            return res.status(422).json({error : err});
        }else{
            return res.json(result);
        }
    })
});



router.put('/unlike',requireLogin,function(req,res){
    Post.findByIdAndUpdate(req.body.postId ,{
        $pull : {likes : req.user._id}
    },{
        new : true
    }).exec((err, result) =>{
        if(err){
            return res.status(422).json({error : err});
        }else{
            return res.json(result);
        }
    })
});

router.put('/comment',requireLogin,function(req,res){
    
    const comment = {
       text :  req.body.text,
       postedBy : req.user._id
    };
    Post.findByIdAndUpdate(req.body.postId ,{
        $push : {comments : comment}
    },{
        new : true
    })
    .populate("comments.postedBy","_id name") 
    .populate("postedBy", "_id name")
    .exec((err, result) =>{
        if(err){
            return res.status(422).json({error : err});
        }else{
            return res.json(result);
        }
    })
});


router.delete('/delete/:postId',requireLogin,function(req,res){
    const id = req.params.postId;
    Post.findByIdAndDelete(id, function(err, result){
        if(err){
            res.status(422).json({error : err});
        }else{
            res.json(result);
        }
    });
});

router.get('/getsubpost',requireLogin,(req,res)=>{

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/myposts',requireLogin,function(req,res){
    Post.find({postedBy : req.user._id})
    .populate("postedBy", "_id name")
    .then(myposts =>{
        res.json({myposts : myposts});
    })
    .catch(err =>{
        console.log(err);
    });
})

module.exports = router;