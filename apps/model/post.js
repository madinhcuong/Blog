var q = require("q");
var db = require('../commemt/database');
var conn = db.getConnection();

// danh sach post
function getAllpost(){
	var defer = q.defer();
	var query = conn.query('SELECT * FROM posts',  function (err, post){
		if(err){
			defer.reject(err);
		}
		else{
			defer.resolve(post);
		}
	});
	return defer.promise;
}

// them bai viet
function addPost(baiviet) {
	if(baiviet){
		var defer = q.defer();
		var query = conn.query('INSERT INTO posts SET ?', baiviet, function (err, result) {
			if (err) {
				defer.reject(err);
			}
			else{
				defer.resolve(result);
			}
		});
		return defer.promise;
	}

	return false;
}

// edit bai viet
function getPostByID(id){
	var defer = q.defer();
	var query = conn.query('SELECT * FROM posts WHERE ?', {id: id},  function (err, posts){
		if(err){
			defer.reject(err);
		}
		else{
			defer.resolve(posts);
		}
	});
	return defer.promise;
}

function updatePost(params){
	if(params){
		var defer = q.defer();
		var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, update_at = ? WHERE id = ?', [params.title, params.content, params.author, new Date(), params.id], function (err, result) {
			if (err) {
				defer.reject(err);
			}
			else{
				defer.resolve(result);
			}
		});
		return defer.promise;
	}
	return false;
}

function deletaPost(id){
	if(id){
		var defer = q.defer();
		var query = conn.query('DELETE FROM posts WHERE id = ?', [id], function (err, result){
			if (err) {
				defer.reject(err);
			}
			else{
				defer.resolve(result);
			}
		});
		return defer.promise;
	}
	return false;
}


module.exports = {
	getAllpost: getAllpost,
	addPost: addPost,
	getPostByID: getPostByID,
	updatePost: updatePost,
	deletaPost: deletaPost
}