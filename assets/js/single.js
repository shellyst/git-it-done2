var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
  // Assign query string to a variable.
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];
  //   Check for valid values before passing them into function calls.
  //   If repoName valid, feed value to the fetch call.
  if (repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
  } else {
    // If no repo was given, redirect to the homepage.
    document.location.replace("./index.html");
  }
};

var getRepoIssues = function (repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  fetch(apiUrl).then(function (response) {
    //   Request was successful.
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);

        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful, redirect to homepage.
      document.location.replace("./index.html");
    }
  });
};

var displayWarning = function (repo) {
  // Add text to warning container.
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
  for (var i = 0; i < issues.length; i++) {
    // Create a link element to take users to the issue on GitHub.
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // Create span to hold issue title.
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // Append to container.
    issueEl.appendChild(titleEl);

    // Create a type element.
    var typeEl = document.createElement("span");

    // Check if issue is an actual issue or a pull request.
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // Append to container.
    issueEl.appendChild(typeEl);

    issueContainerEl.appendChild(issueEl);
  }
};

getRepoName();
