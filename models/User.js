const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    pic : {
        type : String,
        default : "https://res.cloudinary.com/djbqlhith/image/upload/v1597407565/profile-42914_960_720_okxuan.png"
    }
    ,
    followers : [{type : ObjectId, ref : "User"}],
    following : [{type : ObjectId, ref : "User"}],
    password : {
        type : String,
        required : true
    }
});

mongoose.model("User", UserSchema);
