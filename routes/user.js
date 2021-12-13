exports.signup = function (req, res) {
	message = "";
	if (req.method == "POST") {
		var post = req.body;
		var username = post.username;
		var password = post.password;
		var fname = post.first_name;
		var lname = post.last_name;
		var mobile = post.mobile;
		if (username != "" && password != "") {
			var sql =
				"INSERT INTO `users`(`first_name`,`last_name`,`mobile`,`username`, `password`,`rolename`) VALUES ('" +
				fname +
				"','" +
				lname +
				"','" +
				mobile +
				"','" +
				username +
				"','" +
				password +
				"',3)";
			console.log(sql);
			db.query(sql, function (err, result) {
				message = "Your account has been created succesfully.";
				res.render("signup.ejs", { message: message });
			});
		} else {
			message = "Username and password is mandatory field.";
			res.render("signup.ejs", { message: message });
		}
	} else {
		res.render("signup");
	}
};

exports.login = function (req, res) {
	var message = "";
	var sess = req.session;

	if (req.method == "POST") {
		var post = req.body;
		var username = post.username;
		var password = post.password;

		var sql =
			"SELECT id, first_name, last_name, username FROM `users` WHERE `username`='" +
			username +
			"' and password = '" +
			password +
			"'";
		db.query(sql, function (err, results) {
			if (results.length) {
				req.session.userId = results[0].id;
				req.session.user = results[0];
				console.log(results[0].id);
				res.redirect("/home/dashboard");
			} else {
				message = "You have entered invalid username or password.";
				res.render("index.ejs", { message: message });
			}
		});
	} else {
		res.render("index.ejs", { message: message });
	}
};

exports.admindashboard = function (req, res, next) {
	var user = req.session.user,
		userId = req.session.userId;
	console.log("ddd=" + userId);
	if (userId == null) {
		res.redirect("/login");
		return;
	}

	var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

	db.query(sql, function (err, results) {
		res.render("dashboard.ejs", { data: results });
	});
};

exports.dashboard = function (req, res, next) {
	var message = "";
	var sql = "SELECT * FROM `scanreport` order by date desc limit 6";
	db.query(sql, function (err, results) {
		if (results.length) {
			console.log(results);
			res.render("dashboard.ejs", { data: results });
		} else {
			message = "No Record Founds.";
			res.render("dashboard.ejs", { message: message });
		}
	});
};

exports.results = function (req, res, next) {
	console.log("results");
	var message = "";
	var sql = "SELECT * FROM `scanreport` order by date desc";
	db.query(sql, function (err, results) {
		if (results.length) {
			console.log(results);
			res.render("results.ejs", { data: results });
		} else {
			message = "No Record Founds.";
			res.render("results.ejs", { message: message });
		}
	});
};

exports.support = function (req, res, next) {
	console.log("support");
	var message = "";
	res.render("support.ejs", { message: message });
};
exports.scandeatils = function (req, res, next) {
	console.log("req");
	//console.log(req);
	var message = "";
	var scan_id = req.query.scan_id;
	var sql = "SELECT * FROM `scanreport` WHERE scan_id = '" + scan_id + "'";
	db.query(sql, function (err, results) {
		if (results.length) {
			fs = require("fs");
			var filename = results[0]["websitename"] + ".json";
			var filepath =
				//	__dirname +
				"/var/www/html/Sugam/public/json/" + filename;
			let rawdata = fs.readFileSync(filepath);
			let errors = JSON.parse(rawdata);
			console.log(errors);
			var data_array = {};
			data_array[0] = results;
			data_array[1] = errors.issues;

			console.log(data_array);
			res.render("resultdetails.ejs", { data: data_array });
		} else {
			message = "No Record Founds.";
			res.render("resultdetails.ejs", { message: message });
		}
	});
};

exports.profile = function (req, res) {
	var userId = req.session.userId;
	if (userId == null) {
		res.redirect("/login");
		return;
	}

	var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
	db.query(sql, function (err, result) {
		res.render("profile.ejs", { data: result });
	});
};

exports.logout = function (req, res) {
	req.session.destroy(function (err) {
		res.redirect("/login");
	});
};
