//jshint esversion:6

//comment added for Github test

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const user = new User({
      userName: req.body.username,
      password: hash
    });
    user.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
});

});

app.post("/login", function(req,res){
  const submittedUserName = req.body.username;
  const submittedPassword = req.body.password;
  User.findOne({userName: submittedUserName}, function(err,result){
    if(err) {
      console.log(err);
    } else if (bcrypt.compareSync(submittedPassword, result.password)) {
      res.render("secrets");
    } else {
      res.render("login");
    }
  });

});
