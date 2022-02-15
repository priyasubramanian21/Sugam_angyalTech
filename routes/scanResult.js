var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var validUrl = require("valid-url");
const pa11y = require("pa11y");
var fs = require("fs");
var moment = require('moment');


/* GET Scan Result page. */
router.post('/', async function (req, res, next) {


    var message = "";
    const url = req.body.uname;
    const level = req.body.level;
    const version = req.body.version;
    const webCrawling = req.body.webCrawling;
    
    if (url === "") {
        message = "Please add an URL";
        res.render("scan.ejs", {message: message});
    } else {
        //console.log(url);
        var urlID = url.split("/")[2];
        var searchTerm = "/search?q=screen+scraping";
        var childurl = url + searchTerm;
        var arr = [];
        var img = [];
        var vd = [];
        var document = [];
        var folderName = urlID;

        //PROCESS OF CHILD URL DATA
        request(childurl, function (err, resp, body) {
            $ = cheerio.load(body);
            links = $("a"); //jquery get all hyperlinks
            images = $("img");
            videos = $("video");

            $(links).each(function (i, link) {
                var urls = $(link).attr("href");


                if (validUrl.isUri(urls)) {

                    var checkValidUrl = urls.split("/")[2];

                    if (checkValidUrl === urlID) {

                        var lastPart = urls.substr(urls.lastIndexOf("/") + 1);
                        var last3 = lastPart.slice(-3);
                        var doc = ["csv", "pdf", "xls", "txt", "json"];
                        if (doc.includes(last3)) {
                            document.push(urls);
                        } else {
                            arr.push(urls);
                        }

                    }


                } else {


                    var format = /#/;

                    if (!format.test(urls)) {

                        if (typeof urls === 'string') {

                            var lastPart = urls.substr(urls.lastIndexOf("/") + 1);
                            var last3 = lastPart.slice(-3);
                            var doc = ["csv", "pdf", "xls", "txt", "json"];
                            if (doc.includes(last3)) {
                                document.push(urls);
                            } else {

                                if(urls.charAt(0) === '/'){
                                    urls = urls.substring(1);
                                }

                                var mainUrl = 'https://' + urlID + '/' + urls;
                                arr.push(mainUrl);
                            }

                        }
                    }
                }


            });

            var filteredArr = arr.filter(function (item, index) {
                if (arr.indexOf(item) == index) return item;
            });

            var finarr = [];


            for (let l = 0; l < filteredArr.length; l++) {
                var str = filteredArr[l];

                if (
                    str.indexOf("google") >= 0 ||
                    str.indexOf("linkedin") >= 0 ||
                    str.indexOf("facebook") >= 0 ||
                    str.indexOf("javascript") >= 0 ||
                    str.indexOf("pdf") >= 0 ||
                    str.indexOf("twitter") >= 0
                ) {
                } else {
                    finarr.push(str);
                }
            }

            $(images).each(function (j, image) {
                var imag = $(image).attr("src");
                img.push(imag);
            });

            $(videos).each(function (k, video) {
                var videosList = $(video).attr("src");
                vd.push(videosList);
            });
            var imgCount = img.length;
            var vdCount = vd.length;
            var docCount = document.length; 

            getUrlData(
                url,
                folderName,
                finarr,
                version,
                level,
                imgCount,
                vdCount,
                docCount,
                webCrawling
            );
        });


        message = "Url Scanned Successfully . please check Result !";
        res.render("scan.ejs", {message: message});
    }

});


const getUrlData = async (
    url,
    folderName,
    arr,
    version,
    level,
    imgcount,
    vdCount,
    docCount,
    webCrawling
) => {
    const results = await pa11y(url, {
        waitUntil: 'load',
        timeout: 900000000,
        includeNotices: true,
        includeWarnings: true,
        standard: level,
        runners: [
            'axe',
            'htmlcs'
        ],
        //rule: "Principle1.Guideline1_4.1_4_6",
        // version: "WCAG 2.1",
    });


    var newStringName = results.documentTitle.replace(/[^A-Z0-9]/ig, "_");

    var name = newStringName + ".json";
    var currentDate = moment().format('yyyy-mm-dd:hh:mm:ss');
    var foldName = folderName+'-'+currentDate;

    var dir = "public/json/" + foldName;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var filename = "public/json/" + foldName + "/" + name;
    const content = JSON.stringify(results);
    fs.writeFileSync(filename, content);

    var resarry = [];
    resarry[0] = results;    
    resarry[1] = arr;
    resarry[7] = webCrawling;   
    resarry[2] = foldName;
    resarry[3] = level;
    resarry[4] = imgcount;
    resarry[5] = vdCount;
    resarry[6] = docCount;


    var value = getReport(resarry);

    return true;
};


var getReport = function (req, res, next) {


    var scanlevel = "Level A";
    var result = "Pass";
    var rules_failed = 0;
    var frequency = "Ad-hoc";

   
    var webname = req[0].documentTitle;
    var url = req[0].pageUrl;
    var level = req[3];
    var imgCount = req[4];
    var vdCount = req[5];
    var docCount = req[6];
    var webCrawling = req[7];
    
    if(webCrawling == 'Enabling'){
        var present_status = "Pending";
    }else{
        var present_status = "Completed";
    }

    var issues = req[0].issues;

    var numErrors = issues.reduce(function (n, person) {
        return n + (person.typeCode == 1);
    }, 0);
    var numWarning = issues.reduce(function (n, person) {
        return n + (person.typeCode == 2);
    }, 0);
    var numNotices = issues.reduce(function (n, person) {
        return n + (person.typeCode == 3);
    }, 0);
    var total = numErrors + numWarning + numNotices;

    var sql =
        "INSERT INTO `scanreport`(`websitename`, `url`, `scan_level`, `result`, `rules_failed`, `errors`, `warnings`, `notices`, `frequency`, `status`, `total`, `level`, `imgcount`, `vdcount`, `document`, `folder`) VALUES ('" +
        webname +
        "','" +
        url +
        "','" +
        scanlevel +
        "','" +
        result +
        "','" +
        rules_failed +
        "','" +
        numErrors +
        "','" +
        numWarning +
        "','" +
        numNotices +
        "','" +
        frequency +
        "','" +
        present_status +
        "','" +
        total +
        "','" +
        level +
        "','" +
        imgCount +
        "','" +
        vdCount +
        "','" +
        docCount +
        "','" +
        req[2] +
        "')";
    //console.log(sql);
    db.query(sql, function (err, result) {
    });

    if(webCrawling == 'Enabling'){
        var sqlI =
        "SELECT scan_id , errors, warnings, notices, total FROM scanreport ORDER BY scan_id DESC LIMIT 1";
        db.query(sqlI, function (err, results) {
        var scanID = results[0].scan_id;

        for (let k = 0; k < req[1].length; k++) {
            var sql =
                "INSERT INTO `webcrawling`( `scan_id`,  `weburl`,  `folder`) VALUES ('" +
                scanID +
                "','" +
                req[1][k] +
                "','" +
                req[2] +
                "')";
            //console.log(sql);
            db.query(sql, function (err, result) {
            });
        }
        });
    }    

    return true;
};


module.exports = router;
