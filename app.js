
var express = require('express');
var config = require("config");
// lay post len
var bodyParser = require("body-parser");
// session dang nhap
var session = require('express-session');

var socketio = require('socket.io');

var app = express();

// body parser
app.use(bodyParser.json());
// nhan cau lenh gui tu form len
app.use(bodyParser.urlencoded({ extended: true }));

// session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//cai ejs trong view
app. set("views", __dirname+ "/apps/view");
app.set("view engine", "ejs");

// cau hinh static folder
app.use("/static", express.static(__dirname + "/public"));

var controllers = require(__dirname + "/apps/controller");
app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

// vi ta dung expre... nên muôn tich hop socket.io thi ta thêm

// app.listen(port,host, function(){
// 	console.log("hellllo", port);
// });

var server = app.listen(port,host, function(){
	console.log("Server running.....", port);
});

var io = socketio(server);
var socketiocontroll = require("./apps/commemt/socketcontroll")(io);