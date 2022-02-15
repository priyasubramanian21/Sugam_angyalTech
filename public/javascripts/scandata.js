const issuesOutput = document.querySelector("#issues");
const issuesCount = document.querySelector("#number");
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

// Fetch accessibility issues
const testAccessibility = async (e) => {
	e.preventDefault();
	const url = document.querySelector("#url").value;
	if (url === "") {
		issuesOutput.innerHTML = emptyUrl;
	} else {
		setLoading();

		const response = await fetch(`/api/test?url=${url}`);
		if (response.status !== 200) {
			setLoading(false);
			issuesOutput.innerHTML = alertMessage;
		} else {
			const { issues } = await response.json();
			console.log(issues);

			addIssuesToDB(issues);
			setLoading(false);

			//document.getElementById("csvBtn").classList.remove("hideButton");
		}
	}
};

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

// Add issues to DOM
const addIssuesToDB = (issues) => {
	issuesOutput.innerHTML = "";
	issuesCount.innerHTML = "";

	if (issues.length === 0) {
		issuesOutput.innerHTML = warningMessage;
	} else {
		var numErrors = issues.reduce(function (n, person) {
			return n + (person.typeCode == 1);
		}, 0);
		var numWarning = issues.reduce(function (n, person) {
			return n + (person.typeCode == 2);
		}, 0);
		var numNotices = issues.reduce(function (n, person) {
			return n + (person.typeCode == 3);
		}, 0);

		var scanlevel = "Level A";
		var result = "Pass";
		var rules_failed = 0;
		var frequency = "Ad-hoc";
		var total = issues.length;
		var present_status = "In Progress";
		var url = issues.documentTitle;
		var webname = issues.pageUrl;

		issues.forEach((issue) => {
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
				message = "Your account has been created succesfully.";
				issuesOutput.innerHTML = SuccessMessage;
			});
		});
	}
};

// Set loading state
const setLoading = (isLoading = true) => {
	const loader = document.querySelector(".loader");
	if (isLoading) {
		loader.style.display = "block";
		issuesOutput.innerHTML = "";
	} else {
		loader.style.display = "none";
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

document.querySelector("#form").addEventListener("submit", testAccessibility);
//document.querySelector("#clearResults").addEventListener("click", clearResults);
//document.querySelector("#csvBtn").addEventListener("click", csvIssues);
