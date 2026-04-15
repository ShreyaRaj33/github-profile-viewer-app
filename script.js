const btn = document.getElementById("searchBtn");

btn.addEventListener("click", getUser);

async function getUser() {
  const username = document.getElementById("username").value;

  const profileDiv = document.getElementById("profile");
  const reposDiv = document.getElementById("repos");
  const errorDiv = document.getElementById("error");
  const loadingDiv = document.getElementById("loading");

  // Reset UI
  profileDiv.innerHTML = "";
  reposDiv.innerHTML = "";
  errorDiv.classList.add("hidden");

  loadingDiv.classList.remove("hidden");

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    
    if (!userRes.ok) {
      throw new Error("User not found");
    }

    const user = await userRes.json();

    const repoRes = await fetch(user.repos_url);
    const repos = await repoRes.json();

    loadingDiv.classList.add("hidden");

    // Profile Card
    profileDiv.innerHTML = `
      <div class="card">
        <img src="${user.avatar_url}" width="100">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || "No bio available"}</p>
        <p>Followers: ${user.followers}</p>
        <p>Repos: ${user.public_repos}</p>
      </div>
    `;

    // Repo List
    reposDiv.innerHTML = `
      <div class="card">
        <h3>Repositories</h3>
        ${repos.slice(0, 5).map(repo => `
          <p>
            <a href="${repo.html_url}" target="_blank" style="color:#4CAF50;">
              ${repo.name}
            </a>
          </p>
        `).join("")}
      </div>
    `;

  } catch (error) {
    loadingDiv.classList.add("hidden");
    errorDiv.classList.remove("hidden");
    errorDiv.innerText = error.message;
  }
}