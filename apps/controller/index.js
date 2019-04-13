var express = require('express');
var router = express.Router();
var post_md = require("../model/post");

router.use("/admin", require(__dirname+"/admin.js"));
router.use("/blog", require(__dirname+"/blog.js"));

router.get("/", function(req, res){
	var data = post_md.getAllpost();
	data.then(function(posts){
		var data = {
			posts: posts,
			error: false
		};
		res.render("index", {data: data});
	}).catch(function(err){
		res.render("index", {data: {error: "Get post data not"}});
	});
});

router.get("/chat", function(req, res){
	res.render("chat");
});

// export no ra
module.exports = router;