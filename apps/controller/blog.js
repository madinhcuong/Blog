var express = require('express');
var router = express.Router();
var post_md = require("../model/post");

router.get("/chitietbv/:id", function(req, res){
	var params = req.params;
	var id = params.id;
	var data = post_md.getPostByID(id);

	if(data)
	{
		data.then(function(posts){
			var postdata = posts[0];
			var data = {
				post: postdata,
				error: false
			};
			res.render("blog/chitietbv", {data: data});
		}).catch(function(err)
		{
			var data ={error: "not post id"};
			res.render("blog/chitietbv", {data: data});
		});
	}else{
		var data ={error: "not post id"};
		res.render("blog/chitietbv", {data: data});
	}
});

router.get("/about", function(req, res){
	res.render("blog/about");
});

// export no ra
module.exports = router;