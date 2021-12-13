
const alertMessage =
	'<div class="alert alert-danger" role="alert">Something went wrong</div>';
const emptyUrl =
	'<div class="alert alert-danger" role="alert">Please add an URL</div>';
const warningMessage =
	'<div class="alert alert-warning" role="alert">no Issues Found</div>';
const CsvMessage =
	'<div class="alert alert-warning" role="alert">CSV not available</div>';

const SuccessMessage =
	'<div class="alert alert-success" role="alert">Check report</div>';

//Download CSV
const csvIssues = async (e) => {
	e.preventDefault();
	const url = document.querySelector("#url").value;
	if (url === "") {
		issuesOutput.innerHTML = emptyUrl;
	} else {
		const response = await fetch(`/api/test?url=${url}`);

		if (response.status !== 200) {
			setLoading(false);
			alert(csvMessage);
		} else if (issues.length === 0) {
			alert(CsvMessage);
		} else {
			const { issues } = await response.json();
			const csv = issues
				.map((issue) => {
					return `${issue.code},${issue.message},${issue.context}`;
				})
				.join("\n");

			const csvBlob = new Blob([csv], { type: "text/csv" });
			const csvUrl = URL.createObjectURL(csvBlob);
			const link = document.createElement("a");
			link.href = csvUrl;
			link.download =
				"Accessibility_issues_list_" + url.substring(12) + ".csv";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
};

// Escape HTML
function escapeHTML(html) {
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

//Clear results
const clearResults = (e) => {
	e.preventDefault();
	issuesOutput.innerHTML = "";
	issuesCount.innerHTML = "";
	document.querySelector("#url").value = "";
};

exports.scandata = function (req, res, next) {
	var message = "";
	res.render("scandata.ejs", { message: message });
};

exports.getreport = function (req, res, next) {
	console.log("setreport");
	var message = "";
	var scanlevel = "Level A";
	var result = "Pass";
	var rules_failed = 0;
	var frequency = "Ad-hoc";

	var present_status = "Completed";
	var webname = req.documentTitle;
	var url = req.pageUrl;

	var issues = req.issues;

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
		"INSERT INTO `scanreport`(`websitename`, `url`, `scan_level`, `result`, `rules_failed`, `errors`, `warnings`, `notices`, `frequency`, `status`, `total`) VALUES ('" +
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
		"')";
	console.log(sql);
	db.query(sql, function (err, result) {
		message = SuccessMessage;
	});

	console.log("end here");
};
