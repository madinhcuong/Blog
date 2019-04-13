module.exports = function(io){
	var usernames = [];
	io.sockets.on("connection", function(socket){
		console.log("Da co user ket noi");

		// listen add user
		socket.on("adduser", function(username){
			// save
			socket.username = username;
			usernames.push(username);

			// notify to myself
			var data = {
				sender: "SERVER",
				message: " You have chat room"
			};
			socket.emit("up_message", data);

			// notify to orthor user
			var data = {
				sender: "SERVER",
				message: username + " join to chat room"
			};
			socket.broadcast.emit("up_message", data);
			// socket.broadcast.emit gui thoong bao di tru no ra

			// listen send_message
			socket.on("send_message", function(message){

				// notyfy tu my..
				var data = {
					sender: "You",
					message: message
				};
				socket.emit("up_message", data);

				// notify to orthor user
				var data = {
					sender: socket.username,
					message: message
				};
				socket.broadcast.emit("up_message", data);
			});

			// disconnect event 
			socket.on("disconnect", function(){
				// delete user
				for(var i = 0; i < usernames.length; i++){
					if(usernames[i] == socket.username){
						usernames.splice(i,1);
					}
				}

				// notify to orthor user
				var data = {
					sender: "SERVER",
					message: socket.username + " da thoat"
				};
				socket.broadcast.emit("up_message", data);
			});

		});
	});
}