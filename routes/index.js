var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var response = [];
    db.query("SELECT * FROM `scanreport`", function (err, results) {
        if (results.length) {
            var sql = "SELECT * FROM `scanreport` order by date desc limit 6";
            var total = results.length;
            db.query(sql, function (err, result) {
                response[0] = total;
                response[1] = result;
                res.render("home.ejs", {data: response});
            });
        } else {
            res.render("home.ejs", {data: response});
        }
    });


});

module.exports = router;
