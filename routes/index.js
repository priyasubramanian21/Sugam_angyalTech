/*
 * GET home page.
 */

exports.index = function (req, res) {
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
