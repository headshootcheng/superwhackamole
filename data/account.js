let mysql= require('mysql');
let User = mysql.createConnection({
	host: "localhost",
	user: "petercheng",
	password: "1234",
	database: "player"
});
module.exports=User;