//jshint esversion:6

// require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt  = require("mongoose-encryption");
// 哈希加密
const md5 = require('md5');

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, () => {console.log("Server started on port 3000")});

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
})

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB");
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// 第一种加密方式-- mongoose-encryption包
// console.log(process.env.SECRET);
// userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("user", userSchema);


app.post("/register", (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err) => {
        if (!err) {
            res.render("secrets")
        } else {
            console.log(err);
        }
    });
});

app.post("/login", (req, res) => {
    
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:username}, (err, doc) => {
        if (doc){
            if (doc.password === password) {
                res.render("secrets");
            } else {
                res.send("Wrong password.");
            }
        } else if(!doc) {
            res.send("Account doesn't exist.");
        } else if(err) {
            console.log(err);
        }
    })
})