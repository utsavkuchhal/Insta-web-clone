const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/key');
const app = express();
app.use(express.json());

mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true } ,() => {
    console.log("Connected to server");
} );

require('./models/User');
require('./models/Post');


app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve('./client/build/' + 'index.html'))
    })
}

app.get('/about', function(req, res){
    res.send("hello");
})

app.listen(PORT, function(){
    console.log("server is running on port 5000");
});