var express = require('express');
var router = express.Router();
var fs = require("fs");


router.get('/', function (req, res, next) {
  
    var message = "";
    var scan_id = req.query.scan_id;
    var web_id = req.query.web_id;
   
    var sql =
        "SELECT * FROM `scanreport` INNER JOIN `webcrawling` ON scanreport.scan_id = webcrawling.scan_id  AND scanreport.scan_id = '" +
        scan_id +
        "'";
    db.query(sql, function (err, results) {
         
        if (results.length) {
            var data_array = {};
            for (var j = 0; j < results.length; j++) {
                
                if (results[j]["web_id"] == web_id) {                    
                    var intI = j;

                    fs = require("fs");
                   // var getName = results[intI]["webname"].split("/");

                    var newStringName = results[intI]["webname"].replace(/[^A-Z0-9]/ig, "_");

                    var filename = newStringName + ".json";
                    //var folderName = results[0]["url"].split("/")[2];
                    var folderName = results[intI]["folder"];
                    var filepath =
                        //	__dirname +
                        "public/json/" +
                        folderName +
                        "/" +
                        filename;
                    let rawdata = fs.readFileSync(filepath);
                    let errors = JSON.parse(rawdata);
                    data_array[0] = results;
                    data_array[1] = errors.issues; 
                    res.render("resultDetails.ejs", {data: data_array});
                }
            }
        } else {
            message = "No Record Founds.";
            res.render("resultDetails.ejs", {message: message});
        }
    });

});


module.exports = router;