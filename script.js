/* ============ USER / AUTH ============ */
const USER_KEY = "fs_user";
const THEME_KEY = "fs_theme";

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "index.html";
}

/* ============ THEME / DARK MODE ============ */
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);

  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.textContent = saved === "dark" ? "☀️ Light" : "🌙 Dark";

  toggle.addEventListener("click", () => {
    const current = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    toggle.textContent = next === "dark" ? "☀️ Light" : "🌙 Dark";
  });
}

/* ============ NAVBAR STATE ============ */
function initNavbar() {
  const user = getUser();

  const signInBtn = document.getElementById("signInBtn");
  const userMenu = document.getElementById("userMenu");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  const protectCookbook = document.getElementById("protectCookbook");
  const protectFollowing = document.getElementById("protectFollowing");
  const uploadBtn = document.getElementById("uploadBtn");

  if (user) {
    if (signInBtn) signInBtn.style.display = "none";
    if (userMenu) userMenu.classList.remove("hidden");
    if (userNameDisplay) {
      const name =
        user.name && user.name.trim().length > 0
          ? user.name
          : user.email.split("@")[0];
      userNameDisplay.textContent = name;
    }
  } else {
    if (signInBtn) signInBtn.style.display = "inline-block";
    if (userMenu) userMenu.classList.add("hidden");
  }

  function requireLogin(url) {
    if (!getUser()) {
      alert("You must sign in first.");
      window.location.href = "sign-in.html";
    } else {
      window.location.href = url;
    }
  }

  if (protectCookbook) {
    protectCookbook.addEventListener("click", (e) => {
      e.preventDefault();
      requireLogin("my-cookbook.html");
    });
  }

  if (protectFollowing) {
    protectFollowing.addEventListener("click", (e) => {
      e.preventDefault();
      requireLogin("following.html");
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      requireLogin("upload.html");
    });
  }

  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
      userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (ev) => {
      if (!userMenu.contains(ev.target)) {
        userDropdown.classList.add("hidden");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
}

/* ============ NOTIFICATIONS ============ */
function initNotifications() {
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

/* ============ AUTH FORMS ============ */
function initSignInForm() {
  const form = document.getElementById("signInForm");
  if (!form) return;

  const errorEl = document.getElementById("signInError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      if (errorEl) errorEl.textContent = "Email and password are required.";
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      if (errorEl) errorEl.textContent = "Use a @gmail.com email.";
      return;
    }

    // Accept ANY password
    saveUser({ email, name: "" });
    if (errorEl) errorEl.textContent = "";
    window.location.href = "index.html";
  });
}

function initSignUpForm() {
  const form = document.getElementById("signUpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) return;
    if (!email.endsWith("@gmail.com")) {
      alert("Use a @gmail.com email.");
      return;
    }

    saveUser({ email, name });
    window.location.href = "index.html";
  });
}

function initForgotForm() {
  const form = document.getElementById("forgotForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Password reset link sent (demo).");
    window.location.href = "reset-new-password.html";
  });
}

function initResetForm() {
  const form = document.getElementById("resetForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Password updated (demo).");
    window.location.href = "sign-in.html";
  });
}

/* ============ COOKBOOK (per user) ============ */
function getCookbookKey() {
  const user = getUser();
  if (!user) return null;
  return "fs_cookbook_" + user.email;
}

function addToCookbook(id, title, author, image) {
  const user = getUser();
  if (!user) {
    alert("Sign in to save recipes.");
    window.location.href = "sign-in.html";
    return;
  }
  const key = getCookbookKey();
  let list = JSON.parse(localStorage.getItem(key) || "[]");
  if (!list.find((r) => r.id === id)) {
    list.push({ id, title, author, image });
    localStorage.setItem(key, JSON.stringify(list));
    alert("Saved to your cookbook!");
  } else {
    alert("Already in your cookbook.");
  }
}

function loadCookbookPage() {
  const grid = document.getElementById("cookbookGrid");
  const empty = document.getElementById("cookbookEmpty");
  if (!grid) return;

  const user = getUser();
  if (!user) {
    grid.innerHTML = "";
    if (empty) {
      empty.style.display = "block";
      empty.querySelector("p").textContent = "Sign in to view your cookbook.";
    }
    return;
  }

  const key = getCookbookKey();
  let list = JSON.parse(localStorage.getItem(key) || "[]");

  if (list.length === 0) {
    grid.innerHTML = "";
    if (empty) {
      empty.style.display = "block";
      empty.querySelector("p").textContent =
        "You haven't saved any recipes yet.";
    }
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = list
    .map(
      (r) => `
      <article class="recipe-card">
        <img src="${r.image}" alt="${r.title}">
        <div class="info">
          <h3>${r.title}</h3>
          <p class="author">${r.author}</p>
        </div>
      </article>
    `
    )
    .join("");
}

/* ============ RECIPE MODAL ============ */
function openRecipeModal(data) {
  const modal = document.getElementById("recipeModal");
  if (!modal) return;

  document.getElementById("modalImage").src = data.image;
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalAuthor").textContent = "by " + data.author;
  document.getElementById("modalDescription").textContent = data.description;

  const ingList = document.getElementById("modalIngredients");
  ingList.innerHTML = "";
  data.ingredients.forEach((ing) => {
    const li = document.createElement("li");
    li.textContent = ing;
    ingList.appendChild(li);
  });

  const instList = document.getElementById("modalInstructions");
  instList.innerHTML = "";
  data.instructions.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    instList.appendChild(li);
  });

  modal.style.display = "flex";
}

function closeRecipeModal() {
  const modal = document.getElementById("recipeModal");
  if (modal) modal.style.display = "none";
}

/* Close modal when clicking outside of it */
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("recipeModal");
  if (!overlay) return;
  if (e.target === overlay) {
    overlay.style.display = "none";
  }
});

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initSignInForm();
  initSignUpForm();
  initForgotForm();
  initResetForm();
  loadCookbookPage();
});

/* expose cookbook function for inline onClick */
window.addToCookbook = addToCookbook;
window.openRecipeModal = openRecipeModal;
window.closeRecipeModal = closeRecipeModal;

// ========= USER LOGIN STATE =========
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("flavorshareUser");

    const signInBtn = document.getElementById("signInButton");
    const userMenu = document.getElementById("userMenu");
    const navUsername = document.getElementById("navUsername");

    if (username) {
        signInBtn.style.display = "none";
        userMenu.style.display = "block";
        navUsername.textContent = username;
    } else {
        signInBtn.style.display = "inline-block";
        userMenu.style.display = "none";
    }

    // Toggle dropdown
    userMenu.addEventListener("click", () => {
        userMenu.classList.toggle("show");
    });
});

// ========= LOGOUT =========
function logoutUser() {
    localStorage.removeItem("flavorshareUser");
    location.href = "index.html";
}

// ========= NOTIFICATIONS =========
const notifBell = document.getElementById("notifBell");
const notifPanel = document.getElementById("notifPanel");
const notifClose = document.getElementById("notifClose");

notifBell.addEventListener("click", () => {
    notifPanel.style.display = "block";
});
notifClose.addEventListener("click", () => {
    notifPanel.style.display = "none";
});

