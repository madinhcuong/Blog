var bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
var config = require("config");

function hash_password(password){
	// lay do dai pass
	var saltRounds = config.get("salt");
	// ma hoa
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}

// giai ma pass
function compare_password(password, pass){
	return bcrypt.compareSync(password, pass);
}

// export dr dug duoc trong file khac
module.exports = {
	hash_password: hash_password,
	compare_password: compare_password
}