const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const cors=require('cors');
require('./src/db/conn');
const User = require('./src/models/userData');

port=process.env.PORT||5000;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:false }));
app.use(express.static("public"));

app.get('/', (req, res) =>{
    res.render('login',{status:true});
})

app.get('/register',(req, res) => {
    res.render('register',{status:true});
});

app.get('/login', (req, res) => {
    res.render('login',{status:true});
});

app.get('/index',(req,res)=>{
    res.render('index')
});

app.post('/register', async (req, res) => {
    try {
        const oldUser = await User.findOne({email:req.body.email});
        if(oldUser) {
            console.log("User already exists");
            // return res.status(400).json({ errors: "sorry user with this id exists already" });
            return res.status(201).render('register',{status:false});

        }
        const newUser= new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
        });
        
        await newUser.save();
        return res.status(201).redirect('./index');
    }catch(err) {
        console.error(err.message)
        return res.status(500).render('register',{status:false});
    }
});
app.post('/login', async (req, res) => {
    try {
        const {email,password} = req.body;
        
        let user = await User.findOne({email},{password:1});
        if(!user) {
            let e =  new Error("Not an user");
            e.code="NOU";
            throw e;
        }
        const storedPass = user.password;
        const isValid = await bcrypt.compare(password,storedPass);
        
        if(isValid) return res.redirect('./index');
        let error = new Error("passord missmatch");
        error.code ="WP";
        throw error;
    }catch(err) {
        if(err.code==="WP"){
           console.error("Wrong passord")
           return  res.render('login',{status:false});
           //    return res.status(400).json({ errors: "Invalid Credentials" });
           // Handle wrong pass
        }
        if(err.code==="NOU"){
            //res.status(201).render('login',{message:"User does not exist"});
            return  res.render('login',{status:false});
            //console.error("User does not exists");
            // return res.status(400).json({ errors: "User does not exists" });
            // return  res.render('login');
            // Handle no user
            //req.flash('userInvalid','Invalid Log In Credentials');
        }
        // Unhandled
        console.error(err);
        // res.status(500).render('error');
    }
});


app.listen(port, () =>{
    console.log('listening on port 5000');
});