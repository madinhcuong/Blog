var express = require('express');
var router = express.Router();

var user_md = require("../model/user"); 
var helper = require("../helpers/helper"); 
var post_md = require("../model/post");

router.get("/", function(req, res){
	//res.json({"message": "This is admin page"});
	if(req.session.user){
		var data = post_md.getAllpost();
		data.then(function(posts){
			var data = {
				posts: posts,
				error: false
			};
			res.render("admin/dashboard", {data: data});
		}).catch(function(err){
			res.render("admin/dashboard", {data: {error: "Get post data not"}});
		});

	}else{
		res.redirect("/admin/signin");
	}
});

//------- form sigup -----
router.get("/signup", function(req, res){
	res.render("signup", {data: {}});
});

router.post("/signup", function(req, res){
	var user =  req.body;

	if(user.email.trim().length == 0){
		res.render("signup", {data: {error: "Email is required"}});
	}
	if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
		res.render("signup", {data: {error: "Password is not match"}});
	}
//  insert to DB
//var password = helper.hash_password(user.passwd);

user = {
	email: user.email,
	pass: user.passwd,
		//pass: password,
		first_name: user.firstname,
		last_name: user.lastname
	}

	var result = user_md.addUser(user);
	// if(!result){
	// 	res.render("signup", {data: {error: "Could not insert"}});
	// }
	// else{
	// 	//res.json({"message": "insert success"});
	// 	res.render("signup", {data: {error: "insert success"}});

	// } khong nen dung if vi ben kia dung defer.promise va nen dung:
	result.then(function(data){
		//res.render("signup", {data: {error: "insert success"}});
		res.redirect("/admin/signin");
	}).catch(function(err){
		res.render("signup", {data: {error: "Could not insert"}});
	});

});
//-------- end form sigup -------


//------- form signin -----
router.get("/signin", function(req, res){
	if(req.session.user){
		res.redirect("/admin");
	}else{
		res.render("signin", {data: {}});
	}
});
router.post("/signin", function(req, res){
	var params =  req.body;
	if(params.email.trim().length == 0){
		res.render("signin", {data: {error: "Email is required"}});
	}
	// else if(params.password.trim().length == 0){
	// 	res.render("signin", {data: {error: "Password is required"}});
	// }
	else{
		var data = user_md.getUserByEmail(params.email);
		if(data){
			data.then(function(users){
				var user = users[0];
				//var status = helper.compare_password(params.password, user.pass);
				// params.password: lay tu form leen
				// user.password: co tu truoc
				if(params.password == user.pass){
					req.session.user = user;
					console.log(req.session.user);
					//res.render("signin", {data: {error: "password Wrong"}});
					res.redirect("/admin");
				}
				else{
					//res.redirect("/admin");
					res.render("signin", {data: {error: "password Wrong"}});
				}
			});
		}
		else{
			res.render("signin", {data: {error: "user not exists"}});
		}
	}
});
//-------- end form signin -------

//------- add new bai viet -----
router.get("/post/new", function(req, res){
	if(req.session.user){
		res.render("admin/post/new", {data: {error:false}});
	}else{
		res.redirect("/admin/signin");
	}
});
router.post("/post/new", function(req, res){
	var baiviet =  req.body;
	// DB co up.. ceratr.. nen them:
	var now = new Date();

	baiviet = {
		title: baiviet.txttitle,
		content: baiviet.txtcontent,
		author: baiviet.txtauthor,
		created_at: now,
		update_at: now,
	}
	if(baiviet.title.trim().length == 0){
		res.render("admin/post/new", {data: {error: "Title cannot be left blank"}});
	}else{

		var data = post_md.addPost(baiviet);
		data.then(function(result){
			res.redirect("/admin");
		}).catch(function(err){
			var data = {
				error: "Not insert post"
			};
			res.render("admin/post/new", {data: data});
		});
	}
});
//-------- end new bai viet -------

//------- Edit bai viet -----
router.get("/post/edit/:id", function(req, res){
	if(req.session.user){
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
				res.render("admin/post/edit", {data: data});
			}).catch(function(err)
			{
				var data ={error: "not post id"};
				res.render("admin/post/edit", {data: data});
			});
		}else{
			var data ={error: "not post id"};
			res.render("admin/post/edit", {data: data});
		}

	}else
	{
		res.redirect("/admin/signin");
	}
});

router.put("/post/edit", function(req, res){
	var params = req.body;
	data = post_md.updatePost(params);

	if(!data){
		res.json({status_code: 500});
	}else{
		data.then(function(result){
			res.json({status_code: 200});
		}).catch(function(err){
			res.json({status_code: 500});
		});
	}

});
//-------- Edit bai viet -------

// xoa bai viet
router.delete("/post/delete", function(req, res){
	var post_id = req.body.id;
	var data = post_md.deletaPost(post_id);

	if(!data){
		res.json({status_code: 500});
	}else{
		data.then(function(result){
			res.json({status_code: 200});
		}).catch(function(err){
			res.json({status_code: 500});
		});
	}
});

// ----xoa bai viet

//------- trang user -----
router.get("/user", function(req, res){
	if (req.session.user){
		//res.render("admin/user", {data: {error:false}});
		var user = user_md.getUser();
		user.then(function(users){
			var data = {
				user: users,
				error: false
			};
			res.render("admin/user", {data: data});
		}).catch(function(err){
			res.render("admin/user", {data: {error: "Get user data not"}});
		});
	}else{
		res.redirect("/admin/signin");
	}
});

// -------logout 
router.get('/logout', function(req, res){
	if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
    	if(err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

// export no ra
module.exports = router;