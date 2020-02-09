//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();


//set up express
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//set up mongo
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  userName: String,
  password: String
});

const User = mongoose.model("User", userSchema);


//express routes
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/submit", function(req,res){
  res.render("submit");
});

app.post("/register", function(req,res){
  const user = new User({
    userName: req.body.username,
    password: md5(req.body.password)
  });
  user.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const submittedUserName = req.body.username;
  const submittedPassword = req.body.password;
  User.findOne({userName: submittedUserName}, function(err,result){
    if(err) {
      console.log(err);
    } else if(result.password === md5(submittedPassword)) {
      res.render("secrets");
    } else {
      res.render("login");
    }
  });

});
