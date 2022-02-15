var createError = require("http-errors");
var bodyParser = require("body-parser");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
const pa11y = require("pa11y");
const cron = require("node-cron");
var request = require("request");

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "priya",
	database: "sugam",
});

connection.connect();
global.db = connection;

var indexRouter = require("./routes/index");
var scanRouter = require("./routes/scan");
var resultRouter = require("./routes/result");
var resultDetailsRouter = require("./routes/resultDetails");
var scanResultRouter = require("./routes/scanResult");
var childReportRouter = require("./routes/childReport");
var childURLDetailsRouter = require("./routes/childURLDetails");

/*cron.schedule('* * * * *', function () {

    request.get('http://localhost:3000/childReport', function (error, response, body) {
        //console.log(url);
    });

});*/

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true,
	})
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/scan", scanRouter);
app.use("/result", resultRouter);
app.use("/resultDetails", resultDetailsRouter);
app.use("/scanResult", scanResultRouter);
app.use("/childReport", childReportRouter);
app.use("/childURLDetails", childURLDetailsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
