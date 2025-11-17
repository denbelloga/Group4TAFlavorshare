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

/* ============ COOKBOOK (simple) ============ */
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
  initCardPopups(); // 👈 NEW
});

// Keep this at bottom:
window.addToCookbook = addToCookbook;

/* ============ CARD POPUP (EXPAND ON CLICK) ============ */
function initCardPopups() {
  const cards = document.querySelectorAll(".recipe-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // If click is on a button (Save, etc), don't toggle popup
      if (e.target.closest("button")) return;

      const alreadyExpanded = card.classList.contains("expanded");

      // Collapse all cards first
      document
        .querySelectorAll(".recipe-card.expanded")
        .forEach((c) => c.classList.remove("expanded"));

      // If this one wasn't open, open it
      if (!alreadyExpanded) {
        card.classList.add("expanded");
      }
    });
  });

  // Clicking anywhere outside a card closes all
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".recipe-card")) {
      document
        .querySelectorAll(".recipe-card.expanded")
        .forEach((c) => c.classList.remove("expanded"));
    }
  });
}

/* Expose cookbook function for inline onClick */
window.addToCookbook = addToCookbook;

