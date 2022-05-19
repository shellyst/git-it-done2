var getUserRepos = function (user) {
  // Format the Github API Url.
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: Github User Not Found");
      }
    })
    .catch(function (error) {
      //   Notice this `.catch()` getting chained onto the end of the `.then` method.
      alert("Unable to connect to GitHub.");
    });
};

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  event.preventDefault();
  //   Get value from input element.
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a username!");
  }
};

var displayRepos = function (repos, searchTerm) {
  // Check if API returned any repos.
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found";
    return;
  }
  //   Clear old content.
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // Loop over repos.
  for (var i = 0; i < repos.length; i++) {
    // Format repo name.
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // Create a link for each repo.
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    // Create new href attribute since we're converting the repos into single-pages.
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // Create a span element to hold repository name.
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // Create a status element.
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // Check if current repo has issues or not.
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // Append to container.
    repoEl.appendChild(statusEl);

    // Append to container.
    repoEl.appendChild(titleEl);

    // Append container to the DOM.
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
