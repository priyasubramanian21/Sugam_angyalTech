var express = require("express"),
	routes = require("./routes"),
	user = require("./routes/user"),
	scan = require("./routes/scan"),
	http = require("http"),
	fs = require("fs"),
	path = require("path");

//const fetch = require("node-fetch");

var session = require("express-session");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "priya",
	database: "sugam",
});

//API
const pa11y = require("pa11y");
app.use(express.static("public"));

app.get("/api/test", async (req, res) => {
	if (!req.query.url) {
		res.status(400).json({ error: "Url is required" });
	} else {
		const results = await pa11y(req.query.url, {
			includeNotices: true,
			includeWarnings: true,
		});
		res.status(200).json(results);
	}
});
app.get("/home/css/style.css");

//Pa11y Api Ends
connection.connect();
global.db = connection;

app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60000 },
	})
);

app.get("/", routes.index);

app.get("/dashboard", routes.index);

app.get("/dashboard", user.dashboard);

app.get("/signup", user.signup);
app.post("/signup", user.signup);
app.get("/login", user.login);
app.post("/login", user.login);

app.post("/home/dashboard", user.admindashboard);
app.get("/home/dashboard", user.admindashboard);

app.get("/home/logout", user.logout);
app.get("/home/profile", user.profile);

app.get("/scandata", scan.scandata);
app.get("/results", user.results);
app.get("/support", user.support);
app.post("/resultdetails", user.scandeatils);
app.get("/resultdetails", user.scandeatils);

//Download CSV
const geturlData = async (url) => {
	const results = await pa11y(url, {
		includeNotices: true,
		includeWarnings: true,
	});

	var name = results.documentTitle + ".json";
	var filename = "public/json/" + name;
	const content = JSON.stringify(results);
	fs.writeFileSync(filename, content);
	app.post("/setreport", scan.getreport(results));
};

app.post("/getreport", (req, res) => {
	console.log("getreport");
	var message = "";
	const url = req.body.url;
	if (url === "") {
		message = "Please add an URL";
		res.render("scandata.ejs", { message: message });
	} else {
		geturlData(url);
		console.log("end");
		message = "Url Scanned Successfully . please check Result !";
		res.render("scandata.ejs", { message: message });
	}
});

app.post("/setreport", scan.getreport);

app.listen(8080);
