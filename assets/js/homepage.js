var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function (user) {
  // Format the Github API Url.
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        // Need to use a method to extract the JSON from the response.
        // Parse the response.
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

// Makes HTTP request to endpoint using fetch.
var getFeaturedRepos = function (language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "is:featured&sort=help-wanted-issues";

  // Format the response before we display it on the page.
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      // Extract the JSON from the response.
      response.json().then(function (data) {
        //   Pass data.items and parameter's value into displayRepos.
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: Github user not found!");
    }
  });
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

var buttonClickHandler = function (event) {
  // even object has a target property that tells us exactly which HTML element was interacted with to create the event.
  // Once we know which element we interacted with, we can use the getAttribute method to read the data-language attribute's value assigned to the element.
  var language = event.target.getAttribute("data-language");

  if (language) {
    getFeaturedRepos(language);

    // Clear old content.
    repoContainerEl.textContent = "";
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
