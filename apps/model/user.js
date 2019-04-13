var q = require("q");
var db = require('../commemt/database');

var conn = db.getConnection();

// dang ky thanh vien
function addUser(user) {
	if(user){
		var defer = q.defer();
		var query = conn.query('INSERT INTO users SET ?', user, function (err, result) {
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

// dang nhap
function getUserByEmail(email){
	if(email){
		var defer = q.defer();
		var query = conn.query('SELECT * FROM users WHERE ?', {email: email},  function (err, result){
			if(err){
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

// danh sach user
function getUser(){
	var defer = q.defer();
	var query = conn.query('SELECT * FROM users',  function (err, post){
		if(err){
			defer.reject(err);
		}
		else{
			defer.resolve(post);
		}
	});
	return defer.promise;
}

module.exports = {
	addUser: addUser,
	getUserByEmail: getUserByEmail,
	getUser: getUser
}