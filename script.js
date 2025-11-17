/* ============================================================
   FLAVORSHARE — GLOBAL APP SCRIPT (PREMIUM VERSION)
   Handles: Auth, Dark Mode, Likes, Cookbook, Notifications,
            Recipe Modal, UI Sync Across All Pages
============================================================ */

/* ------------------------------------------------------------
   USER AUTH SYSTEM
------------------------------------------------------------ */
function getUser() {
  return JSON.parse(localStorage.getItem("flavorUser")) || null;
}

function signInUser(email) {
  const user = { email, name: email.split("@")[0] };
  localStorage.setItem("flavorUser", JSON.stringify(user));
}

function signOutUser() {
  localStorage.removeItem("flavorUser");
  window.location.href = "sign-in.html";
}

/* ------------------------------------------------------------
   DARK MODE
------------------------------------------------------------ */
const darkModeToggle = document.querySelector("#darkModeToggle");

function applyDarkMode() {
  const enabled = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", enabled);

  if (darkModeToggle) {
    darkModeToggle.textContent = enabled ? "🌙" : "☀️";
  }
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    const current = localStorage.getItem("darkMode") === "true";
    localStorage.setItem("darkMode", !current);
    applyDarkMode();
  });
}

applyDarkMode();

/* ------------------------------------------------------------
   COOKBOOK (SAVE RECIPE)
------------------------------------------------------------ */
function getCookbook() {
  return JSON.parse(localStorage.getItem("cookbook")) || [];
}

function saveRecipe(recipe) {
  const list = getCookbook();
  if (!list.find(r => r.title === recipe.title)) {
    list.push(recipe);
    localStorage.setItem("cookbook", JSON.stringify(list));
    addNotification(`Saved "${recipe.title}" to your Cookbook`);
  }
}

/* ------------------------------------------------------------
   LIKE SYSTEM
------------------------------------------------------------ */
function toggleLike(recipeTitle) {
  let likes = JSON.parse(localStorage.getItem("likes")) || {};
  likes[recipeTitle] = (likes[recipeTitle] || 0) + 1;
  localStorage.setItem("likes", JSON.stringify(likes));
  addNotification(`You liked "${recipeTitle}"`);
}

/* ------------------------------------------------------------
   NOTIFICATIONS
------------------------------------------------------------ */
function getNotifications() {
  return JSON.parse(localStorage.getItem("notifications")) || [];
}

function addNotification(text) {
  const list = getNotifications();
  list.unshift({ text, time: Date.now() });
  localStorage.setItem("notifications", JSON.stringify(list));
  showNotificationPanel();
}

function showNotificationPanel() {
  const panel = document.getElementById("notif-panel");
  const container = document.getElementById("notif-content");

  if (!panel || !container) return;

  const list = getNotifications();

  container.innerHTML = list
    .map(n => `<p>${n.text}</p>`)
    .join("");

  panel.classList.add("show");
}

/* Bell icon toggle */
const bell = document.querySelector(".notif-bell");
if (bell) {
  bell.addEventListener("click", showNotificationPanel);
}

document.addEventListener("click", e => {
  const panel = document.getElementById("notif-panel");
  if (panel && !panel.contains(e.target) && !bell.contains(e.target)) {
    panel.classList.remove("show");
  }
});

/* ------------------------------------------------------------
   RECIPE MODAL SYSTEM
------------------------------------------------------------ */
function openRecipeModal(title, image, description) {
  const modal = document.getElementById("recipe-modal");
  if (!modal) return;

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-image").src = image;
  document.getElementById("modal-description").textContent = description;

  modal.classList.add("show");
}

function closeRecipeModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) modal.classList.remove("show");
}

/* Close modal click outside */
document.addEventListener("click", e => {
  const modal = document.getElementById("recipe-modal");
  const inner = document.querySelector(".modal-inner");
  if (modal && modal.classList.contains("show")) {
    if (!inner.contains(e.target)) closeRecipeModal();
  }
});

/* ------------------------------------------------------------
   AUTO-CONFIGURE CARDS (LIKE + SAVE + MODAL)
------------------------------------------------------------ */
function setupRecipeCards() {
  document.querySelectorAll(".recipe-card").forEach(card => {
    const title = card.dataset.title;
    const img = card.dataset.img;
    const desc = card.dataset.desc;

    /* OPEN MODAL */
    card.addEventListener("click", e => {
      if (e.target.classList.contains("save-btn")) return;
      if (e.target.classList.contains("like-btn")) return;
      openRecipeModal(title, img, desc);
    });

    /* SAVE BUTTON */
    const saveBtn = card.querySelector(".save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", e => {
        e.stopPropagation();
        saveRecipe({ title, img, desc });
      });
    }

    /* LIKE BUTTON */
    const likeBtn = card.querySelector(".like-btn");
    if (likeBtn) {
      likeBtn.addEventListener("click", e => {
        e.stopPropagation();
        toggleLike(title);
        let likes = JSON.parse(localStorage.getItem("likes")) || {};
        likeBtn.querySelector("span").textContent = likes[title] || 0;
      });
    }
  });
}

setupRecipeCards();

/* ------------------------------------------------------------
   EXPORT FUNCTIONS (Optional)
------------------------------------------------------------ */
window.FlavorShare = {
  getUser,
  signInUser,
  signOutUser,
  saveRecipe,
  toggleLike,
  openRecipeModal
};
