/* ===========================================================
   FLAVORSHARE MASTER SCRIPT.JS
   Handles: Auth, UI Sync, Dark Mode, Cookbook, Likes, Comments
=========================================================== */

/* -----------------------------------------------------------
   AUTH: Retrieve Active User
----------------------------------------------------------- */
function getActiveUser() {
  return JSON.parse(localStorage.getItem("activeUser")) || null;
}

/* -----------------------------------------------------------
   NAV BAR USERNAME HANDLING
----------------------------------------------------------- */
function updateNavUserState() {
  const user = getActiveUser();
  const signInBtn = document.querySelector(".sign-in-btn");
  const actionsContainer = document.querySelector(".actions");

  // If no user logged in → show Sign In
  if (!user) {
    if (signInBtn) signInBtn.style.display = "inline-block";
    removeUserDropdown();
    return;
  }

  // Hide Sign In
  if (signInBtn) signInBtn.style.display = "none";

  // Add username with dropdown
  injectUserDropdown(user.username);
}

function injectUserDropdown(username) {
  if (document.querySelector(".user-dropdown")) return; // Prevent duplicates

  const actions = document.querySelector(".actions");
  const dropdown = document.createElement("div");
  dropdown.className = "user-dropdown";
  dropdown.innerHTML = `
    <button class="user-menu-btn">${username} ▾</button>
    <div class="dropdown-menu">
      <button id="logoutBtn">Log Out</button>
    </div>
  `;

  actions.appendChild(dropdown);

  // Toggle dropdown menu
  dropdown.querySelector(".user-menu-btn").addEventListener("click", () => {
    dropdown.querySelector(".dropdown-menu").classList.toggle("show");
  });

  // Logout
  dropdown.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("activeUser");
    window.location.href = "sign-in.html";
  });
}

function removeUserDropdown() {
  const dropdown = document.querySelector(".user-dropdown");
  if (dropdown) dropdown.remove();
}

/* -----------------------------------------------------------
   PROTECT PAGES (Cookbook & Following)
----------------------------------------------------------- */
function protectPages() {
  const protectedPages = ["my-cookbook.html", "following.html"];
  const current = window.location.pathname.split("/").pop();

  if (protectedPages.includes(current)) {
    if (!getActiveUser()) {
      alert("You must be signed in to view this page.");
      window.location.href = "sign-in.html";
    }
  }
}

/* -----------------------------------------------------------
   SIGN IN LOGIC
----------------------------------------------------------- */
function setupSignInForm() {
  const form = document.getElementById("signInForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem("activeUser", JSON.stringify(user));

    // Animated redirect
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 400);
  });
}

/* -----------------------------------------------------------
   SIGN UP LOGIC
----------------------------------------------------------- */
function setupSignUpForm() {
  const form = document.getElementById("signUpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.email === email)) {
      alert("Account already exists.");
      return;
    }

    const newUser = { username, email, password, cookbook: [] };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("activeUser", JSON.stringify(newUser));

    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 400);
  });
}

/* -----------------------------------------------------------
   SAVE TO COOKBOOK
----------------------------------------------------------- */
function saveRecipe(recipeId) {
  const user = getActiveUser();
  if (!user) return alert("You must be logged in.");

  const users = JSON.parse(localStorage.getItem("users"));
  const current = users.find(u => u.email === user.email);

  if (!current.cookbook.includes(recipeId)) {
    current.cookbook.push(recipeId);
  }

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("activeUser", JSON.stringify(current));

  alert("Recipe saved to your cookbook!");
}

/* -----------------------------------------------------------
   LOAD COOKBOOK PAGE
----------------------------------------------------------- */
function loadCookbook() {
  const container = document.getElementById("cookbookGrid");
  if (!container) return;

  const user = getActiveUser();
  if (!user) return;

  if (user.cookbook.length === 0) {
    container.innerHTML = `<p>You haven't saved any recipes yet.</p>`;
    return;
  }

  container.innerHTML = user.cookbook
    .map(id => `
      <div class="recipe-card">
        <img src="images/recipes/${id}.jpg" />
        <div class="info">
          <h3>Recipe #${id}</h3>
        </div>
      </div>
    `)
    .join("");
}

/* -----------------------------------------------------------
   LIKES & COMMENTS
----------------------------------------------------------- */
function handleLike(id) {
  let likes = JSON.parse(localStorage.getItem("likes") || "{}");
  likes[id] = (likes[id] || 0) + 1;
  localStorage.setItem("likes", JSON.stringify(likes));
  updateLikeDisplay(id);
}

function updateLikeDisplay(id) {
  const likes = JSON.parse(localStorage.getItem("likes") || "{}");
  const el = document.querySelector(`[data-like="${id}"]`);
  if (el) el.textContent = likes[id] || 0;
}

/* -----------------------------------------------------------
   DARK MODE SYSTEM
----------------------------------------------------------- */
function setupDarkMode() {
  const toggle = document.getElementById("darkToggle");
  if (!toggle) return;

  // Load saved mode
  const saved = localStorage.getItem("darkMode");
  if (saved === "enabled") {
    document.body.classList.add("dark");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

/* -----------------------------------------------------------
   NOTIFICATION PANEL
----------------------------------------------------------- */
function setupNotifications() {
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  const closeBtn = document.getElementById("notifClose");

  if (!bell || !panel) return;

  bell.addEventListener("click", () => {
    panel.classList.toggle("show");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("show");
    });
  }
}

/* -----------------------------------------------------------
   INITIALIZATION
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  updateNavUserState();
  protectPages();
  setupSignInForm();
  setupSignUpForm();
  loadCookbook();
  setupDarkMode();
  setupNotifications();
});
