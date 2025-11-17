/* ============================================================
   USER AUTH — LocalStorage Mock Login
============================================================ */

// Save user to localStorage
function saveUser(user) {
  localStorage.setItem("flavorUser", JSON.stringify(user));
}

// Get logged-in user
function getUser() {
  return JSON.parse(localStorage.getItem("flavorUser"));
}

// Log out
function signOutUser() {
  localStorage.removeItem("flavorUser");
  window.location.href = "sign-in.html";
}

/* ============================================================
   SIGN-IN FORM HANDLER
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("signInForm");

  if (signInForm) {
    signInForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;

      if (!email.endsWith("@gmail.com")) {
        alert("Email must end with @gmail.com");
        return;
      }

      if (pass.trim() === "") {
        alert("Password cannot be empty");
        return;
      }

      // Mock successful login
      saveUser({
        name: email.split("@")[0],
        email: email
      });

      // Redirect to homepage
      window.location.href = "index.html";
    });
  }

  refreshUserMenu();
});

/* ============================================================
   USER MENU DROPDOWN (NO My Cookbook)
============================================================ */

function refreshUserMenu() {
  const user = getUser();
  const signInBtn = document.querySelector(".sign-in-btn");
  const actions = document.querySelector(".actions");

  if (!actions) return;

  // Remove old dropdown
  const oldMenu = document.querySelector(".user-menu-container");
  if (oldMenu) oldMenu.remove();

  // Not logged in → show sign-in button
  if (!user) {
    if (signInBtn) signInBtn.style.display = "inline-block";
    return;
  }

  // Hide sign-in button
  if (signInBtn) signInBtn.style.display = "none";

  // Create dropdown
  const container = document.createElement("div");
  container.className = "user-menu-container";

  container.innerHTML = `
    <div class="user-pill">
      👤 ${user.name} ▼
    </div>

    <div class="user-dropdown">
      <a href="my-profile.html">My Profile</a>
      <button id="logoutBtn">Log Out</button>
    </div>
  `;

  actions.appendChild(container);

  const userPill = container.querySelector(".user-pill");
  const dropdown = container.querySelector(".user-dropdown");

  userPill.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) dropdown.classList.remove("show");
  });

  container.querySelector("#logoutBtn").addEventListener("click", () => {
    signOutUser();
  });
}

