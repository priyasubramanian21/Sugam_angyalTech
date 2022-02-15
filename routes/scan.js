var express = require('express');
var router = express.Router();

/* GET Scan page. */
router.get('/', function (req, res, next) {

    db.query("SELECT * FROM `scanreport`", function (err, results) {
        if (results.length) {
            var sql = "SELECT status FROM scanreport ORDER BY scan_id DESC LIMIT 1";
            db.query(sql, function (err, result) {
                var status = result[0].status;
                res.render("scan.ejs", {message: status});
            });
        } else {
            res.render("scan.ejs", {message: "Done"});
        }
    });


});

module.exports = router;
