//APP configuration
var express = require('express');
var mongoose = require('mongoose');
var methodoveride = require('method-override');
var bodyparser = require('body-parser');
var app = express();

//DATBASE SETUP
 mongoose.connect("mongodb://localhost/finalcredit", { useNewUrlParser: true, 
				  useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodoveride("_method"));
app.use(bodyparser.urlencoded({extended:true}));


//Setting up schemas
var userSchema = new mongoose.Schema({
	sno: Number,
	name: String,
	email: String,
	age: Number,
	Credits: Number
 });
var user = mongoose.model("user",userSchema);
//ROUTES
//home page route
app.get("/", function(req, res){
	res.render("home")
});
//view all users route
app.get("/users", function(req, res){
	user.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		else{
			res.render("user",{users: users});
		}
	});
});
//general information route
app.get("/information", function(req, res){
	res.render("information");
});
// user data route
app.get("/users/:id", function(req, res){
	user.findById(req.params.id, function(err, users){
		if(err){
			console.log(err);
		}
		else{
			res.render("data",{users: users});
		}
	});
});
// route
app.get("/users/:id/edit", function(req, res){
	user.findById(req.params.id, function(err, users){
		if(err){
			console.log("err");
		}
		else{
			res.render("transactions",{user: users});
		}
	});
});
//update data route
app.put("/users/:id", function(req, res){
	user.findByIdAndUpdate(req.params.id ,{ $inc: {Credits: -req.body.credit}}, function(err, users){
		if(err){
			console.log(err);
		}
		else{
			console.log("Transfer done");
		}
	}), 	user.findOneAndUpdate({name: req.body.name}, { $inc: {Credits: req.body.credit}}, function(err, users){
		if(err){
			console.log(err);
		}
		else{
			  res.redirect("/users");
		}
	});
});
//SERVER STARTING
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Server Started");
});
