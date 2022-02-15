var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET ResultDetails page. */
router.get('/', function (req, res, next) {

    fs = require("fs");

    var message = "";
    var scan_id = req.query.scan_id;

    //console.log(scan_id);

    var sql =
        "SELECT * FROM `scanreport` INNER JOIN `webcrawling` ON scanreport.scan_id = webcrawling.scan_id  AND scanreport.scan_id = '" +
        scan_id +
        "'";
    db.query(sql, function (err, results) {

        if (results.length) {

            var newStringName = results[0]["websitename"].replace(/[^A-Z0-9]/ig, "_");
            var filename = newStringName + ".json";
           // var folderName = results[0]["url"].split("/")[2];
            var folderName = results[0]["folder"];

            var filepath = "public/json/" + folderName + "/" + filename;
            let rawdata = fs.readFileSync(filepath);
            let errors = JSON.parse(rawdata);

            var data_array = {};
            data_array[0] = results;
            data_array[1] = errors.issues;

            res.render("resultDetails.ejs", {data: data_array});
        } else {
            console.log(results.length);


            var sql =
                "SELECT * FROM `scanreport` WHERE scan_id = '" +
                scan_id +
                "'";
            db.query(sql, function (err, results) {
                if (results.length) {

                    var newStringName = results[0]["websitename"].replace(/[^A-Z0-9]/ig, "_");

                    var filename = newStringName + ".json";
                   // var folderName = results[0]["url"].split("/")[2];
                    var folderName = results[0]["folder"];

                    var filepath = "public/json/" + folderName + "/" + filename;
                    let rawdata = fs.readFileSync(filepath);
                    let errors = JSON.parse(rawdata);

                    var data_array = {};
                    data_array[0] = results;
                    data_array[1] = errors.issues;

                    //console.log(data_array);
                    res.render("resultDetails.ejs", {data: data_array});
                } else {
                    message = "No Record Founds.";
                    res.render("resultDetails.ejs", {message: message});
                }
            });
        }
    });

});

module.exports = router;
