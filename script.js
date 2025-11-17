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
    const isDark = document.body.classList.contains("dark-mode");
    const next = isDark ? "light" : "dark";
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

  // Show user dropdown OR sign-in button
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

  // 🔒 Require Login for Protected Pages
  function requireLogin(url) {
    if (!getUser()) {
      window.location.href = "sign-in.html";
    } else {
      window.location.href = url;
    }
  }

  // My Cookbook
  if (protectCookbook) {
    protectCookbook.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      }
    });
  }

  // Following
  if (protectFollowing) {
    protectFollowing.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      }
    });
  }

  // Upload
  if (uploadBtn) {
    uploadBtn.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      } else {
        window.location.href = "upload.html";
      }
    });
  }

  // User dropdown toggle
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

    saveUser({ email, name: "" });
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

/* ============ COOKBOOK (localStorage-based) ============ */
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
function showSuccessMessage(msg) {
  const popup = document.getElementById("successPopup");
  if (!popup) return;

  popup.textContent = msg;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}
function initUploadForm() {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = getUser();
    if (!user) {
      alert("Please sign in first.");
      window.location.href = "sign-in.html";
      return;
    }

    // Example fields — adjust names to your exact HTML fields
    const title = form.title.value.trim();
    const author = user.name || user.email;
    const image = form.image.value; // or uploaded preview URL

    if (!title || !image) {
      alert("Please fill out required fields.");
      return;
    }

    showSuccessMessage("Recipe added successfully!");

    form.reset();
  });
}

/* ============ INIT EVERYTHING ============ */
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
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initSignInForm();
  initSignUpForm();
  initForgotForm();
  initResetForm();
  loadCookbookPage();
  initUploadForm(); // ← ADD THIS
});


/* Allow inline onclick access */
window.addToCookbook = addToCookbook;
