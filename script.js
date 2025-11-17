/* ===================== USERS & AUTH ===================== */

const USERS_KEY = "fs_users";
const ACTIVE_EMAIL_KEY = "fs_active_email";
const LIKES_KEY = "fs_likes";
const NOTIF_KEY = "fs_notifications";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setActiveUserEmail(email) {
  localStorage.setItem(ACTIVE_EMAIL_KEY, email);
}

function getActiveUser() {
  const email = localStorage.getItem(ACTIVE_EMAIL_KEY);
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

function isLoggedIn() {
  return !!getActiveUser();
}

/* ===================== NAVBAR USER MENU ===================== */

function updateNavUserState() {
  const actions = document.querySelector(".actions");
  if (!actions) return;

  const signInBtn = actions.querySelector(".sign-in-btn");
  const existingMenu = actions.querySelector(".user-menu-container");

  if (existingMenu) existingMenu.remove();

  const user = getActiveUser();
  if (!user) {
    if (signInBtn) signInBtn.style.display = "inline-block";
    return;
  }

  if (signInBtn) signInBtn.style.display = "none";

  const container = document.createElement("div");
  container.className = "user-menu-container";
  container.innerHTML = `
    <button class="user-pill">👤 ${user.username} ▾</button>
    <div class="user-menu">
      <button type="button" class="logout-btn">Log Out</button>
    </div>
  `;
  actions.appendChild(container);

  const pill = container.querySelector(".user-pill");
  const menu = container.querySelector(".user-menu");
  pill.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  container.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem(ACTIVE_EMAIL_KEY);
    window.location.href = "sign-in.html";
  });

  document.addEventListener("click", e => {
    if (!container.contains(e.target)) menu.classList.remove("show");
  });
}

/* ===================== LOGIN REQUIRED MODAL ===================== */

function showLoginRequiredModal() {
  const modal = document.getElementById("loginRequiredModal");
  if (modal) modal.classList.add("show");
}

/* ===================== NOTIFICATIONS ===================== */

function getNotifications() {
  return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

function addNotification(text) {
  const list = getNotifications();
  list.unshift({ text, time: Date.now() });
  saveNotifications(list);
  renderNotifications();
}

function renderNotifications() {
  const list = getNotifications();
  const ul = document.getElementById("notifList");
  if (!ul) return;

  if (list.length === 0) {
    ul.innerHTML = "<li>No notifications yet.</li>";
    return;
  }

  ul.innerHTML = list
    .slice(0, 5)
    .map(n => `<li>${n.text}</li>`)
    .join("");
}

function setupNotificationUI() {
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  const closeBtn = document.getElementById("notifClose");
  if (!bell || !panel) return;

  bell.addEventListener("click", () => {
    panel.classList.toggle("show");
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", () => panel.classList.remove("show"));
  }

  renderNotifications();
}

/* ===================== COOKBOOK ===================== */

function saveRecipeToCookbook(id, title, image, author) {
  const user = getActiveUser();
  if (!user) {
    showLoginRequiredModal();
    return;
  }

  const users = getUsers();
  const idx = users.findIndex(u => u.email === user.email);
  if (idx === -1) return;

  if (!Array.isArray(users[idx].cookbook)) {
    users[idx].cookbook = [];
  }

  const exists = users[idx].cookbook.some(r => r.id === id);
  if (!exists) {
    users[idx].cookbook.push({ id, title, image, author });
    saveUsers(users);
    addNotification(`Saved "${title}" to your cookbook.`);
    alert("Recipe saved to your cookbook!");
  } else {
    alert("Recipe is already in your cookbook.");
  }

  // refresh active user in memory
}

function removeRecipeFromCookbook(id) {
  const user = getActiveUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex(u => u.email === user.email);
  if (idx === -1) return;

  users[idx].cookbook = (users[idx].cookbook || []).filter(r => r.id !== id);
  saveUsers(users);
  loadCookbookPage();
}

function loadCookbookPage() {
  const grid = document.getElementById("cookbookGrid");
  const empty = document.getElementById("cookbookEmpty");
  if (!grid) return;

  const user = getActiveUser();
  if (!user) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "none";
    showLoginRequiredModal();
    return;
  }

  const users = getUsers();
  const fullUser = users.find(u => u.email === user.email);
  const list = (fullUser && fullUser.cookbook) || [];

  if (list.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = list
    .map(
      r => `
      <article class="recipe-card">
        <img src="${r.image}" alt="${r.title}">
        <div class="info">
          <h3>${r.title}</h3>
          <p class="author">${r.author}</p>
          <div class="card-actions">
            <button class="secondary-btn" onclick="removeRecipeFromCookbook('${r.id}')">
              Remove
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

/* ===================== LIKES ===================== */

function getLikesMap() {
  return JSON.parse(localStorage.getItem(LIKES_KEY) || "{}");
}

function saveLikesMap(map) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(map));
}

function initLikeCounts() {
  const map = getLikesMap();
  document.querySelectorAll("[data-like-count]").forEach(span => {
    const id = span.getAttribute("data-like-count");
    span.textContent = map[id] || 0;
  });
}

function likeRecipe(id, title) {
  const map = getLikesMap();
  map[id] = (map[id] || 0) + 1;
  saveLikesMap(map);
  initLikeCounts();
  addNotification(`You liked "${title}".`);
}

/* ===================== PAGE PROTECTION ===================== */

function protectPages() {
  const protectedPages = ["my-cookbook.html", "following.html", "upload.html"];
  const current = window.location.pathname.split("/").pop() || "index.html";

  if (protectedPages.includes(current) && !isLoggedIn()) {
    showLoginRequiredModal();
  }
}

/* ===================== AUTH FORMS ===================== */

function setupSignUpForm() {
  const form = document.getElementById("signUpForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email.endsWith("@gmail.com")) {
      alert("Email must end with @gmail.com");
      return;
    }

    let users = getUsers();
    if (users.some(u => u.email === email)) {
      alert("An account with this email already exists.");
      return;
    }

    const newUser = { username, email, password, cookbook: [] };
    users.push(newUser);
    saveUsers(users);
    setActiveUserEmail(email);
    window.location.href = "index.html";
  });
}

function setupSignInForm() {
  const form = document.getElementById("signInForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    setActiveUserEmail(email);
    window.location.href = "index.html";
  });
}

function setupForgotForm() {
  const form = document.getElementById("forgotForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("A reset link has been sent (demo).");
    window.location.href = "reset-password.html";
  });
}

function setupResetForm() {
  const form = document.getElementById("resetForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Password updated (demo).");
    window.location.href = "sign-in.html";
  });
}

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
  updateNavUserState();
  setupNotificationUI();
  protectPages();
  loadCookbookPage();
  initLikeCounts();

  setupSignUpForm();
  setupSignInForm();
  setupForgotForm();
  setupResetForm();
});

/* expose some functions globally for inline onclick */
window.saveRecipeToCookbook = saveRecipeToCookbook;
window.likeRecipe = likeRecipe;
window.removeRecipeFromCookbook = removeRecipeFromCookbook;
