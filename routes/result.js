var express = require('express');
var router = express.Router();

/* GET Result page. */
router.get('/', function (req, res, next) {


    var sql = "SELECT * FROM `scanreport` order by date desc";
    db.query(sql, function (err, results) {
        if (results.length) {

            res.render("result.ejs", { data: results });
        } else {
            var response = [];
            res.render("result.ejs", {data: response});
        }
    });

});

module.exports = router;
