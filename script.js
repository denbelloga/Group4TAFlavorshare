/* ============================================
   USER / AUTH
============================================ */
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


/* ============================================
   RECIPE POPUP DATA (static examples)
============================================ */
const recipeData = {
  "creamy-carbonara": {
    title: "Creamy Carbonara",
    author: "Maria Romano",
    image: "images/creamy-carbonara-1-4.jpg",
    description: "A silky Italian pasta with eggs, parmesan, and crispy pancetta.",
    ingredients: ["200g spaghetti", "2 eggs", "1/2 cup parmesan cheese", "Pancetta", "Salt and pepper"],
    steps: ["Boil pasta", "Cook pancetta", "Mix eggs & cheese", "Combine", "Serve warm"]
  },

  "rainbow-cupcakes": {
    title: "Rainbow Cupcakes",
    author: "Emma Baker",
    image: "images/rainbow-cupcakes-17.jpg",
    description: "Colorful, fun cupcakes perfect for birthdays and parties.",
    ingredients: ["Flour", "Butter", "Sugar", "Eggs", "Food coloring"],
    steps: ["Mix batter", "Add colors", "Pour", "Bake"]
  },

  "thai-green-curry": {
    title: "Thai Green Curry",
    author: "Alex Chen",
    image: "images/Thai-Green-Curry-square-FS.jpg",
    description: "A rich Thai curry with coconut milk, chicken, and herbs.",
    ingredients: ["Chicken", "Coconut Milk", "Green Curry Paste", "Vegetables"],
    steps: ["Cook chicken", "Add paste", "Add coconut milk", "Simmer"]
  }
};


/* ============================================
   POPUP OPEN FUNCTION
============================================ */
function openRecipePopup(id) {
  const data = recipeData[id];
  if (!data) return;

  document.getElementById("modalImage").src = data.image;
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalAuthor").textContent = "by " + data.author;
  document.getElementById("modalDescription").textContent = data.description;

  document.getElementById("modalIngredients").innerHTML =
    data.ingredients.map(i => `<li>${i}</li>`).join("");

  document.getElementById("modalSteps").innerHTML =
    data.steps.map(s => `<li>${s}</li>`).join("");

  document.getElementById("recipeModal").classList.remove("hidden");
}


/* ============================================
   THEME / DARK MODE
============================================ */
function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);

  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.textContent = saved === "dark" ? "☀️ Light" : "🌙 Dark";

  toggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
    toggle.textContent = newTheme === "dark" ? "☀️ Light" : "🌙 Dark";
  });
}


/* ============================================
   NAVBAR
============================================ */
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
    if (userNameDisplay) userNameDisplay.textContent = user.name || user.email.split("@")[0];
  } else {
    if (signInBtn) signInBtn.style.display = "inline-block";
    if (userMenu) userMenu.classList.add("hidden");
  }

  const protect = (el, url) => {
    if (!el) return;
    el.addEventListener("click", e => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      } else {
        window.location.href = url;
      }
    });
  };

  protect(protectCookbook, "my-cookbook.html");
  protect(protectFollowing, "following.html");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", e => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      } else {
        window.location.href = "upload.html";
      }
    });
  }

  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () =>
      userDropdown.classList.toggle("hidden")
    );

    document.addEventListener("click", ev => {
      if (!userMenu.contains(ev.target)) userDropdown.classList.add("hidden");
    });
  }

  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
}


/* ============================================
   NOTIFICATIONS
============================================ */
function initNotifications() {
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  const closeBtn = document.getElementById("notifClose");

  if (!bell || !panel) return;

  bell.addEventListener("click", () => panel.classList.toggle("show"));
  if (closeBtn) closeBtn.addEventListener("click", () => panel.classList.remove("show"));
}


/* ============================================
   AUTH FORMS
============================================ */
function initSignInForm() {
  const form = document.getElementById("signInForm");
  if (!form) return;

  const errorEl = document.getElementById("signInError");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      errorEl.textContent = "Email and password are required.";
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      errorEl.textContent = "Use a @gmail.com email.";
      return;
    }

    saveUser({ email, name: "" });
    window.location.href = "index.html";
  });
}

function initSignUpForm() {
  const form = document.getElementById("signUpForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!email.endsWith("@gmail.com")) {
      alert("Use a @gmail.com email.");
      return;
    }

    saveUser({ email, name });
    window.location.href = "index.html";
  });
}


/* ============================================
   COOKBOOK STORAGE
============================================ */
function getCookbookKey() {
  const user = getUser();
  return user ? "fs_cookbook_" + user.email : null;
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

  if (!list.some(r => r.id === id)) {
    list.push({ id, title, author, image });
    localStorage.setItem(key, JSON.stringify(list));
    alert("Saved to your cookbook!");
  } else {
    alert("Already saved!");
  }
}

function loadCookbookPage() {
  const grid = document.getElementById("cookbookGrid");
  const empty = document.getElementById("cookbookEmpty");

  if (!grid) return;

  const user = getUser();
  if (!user) {
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Sign in to view your cookbook.";
    return;
  }

  const list = JSON.parse(localStorage.getItem(getCookbookKey()) || "[]");

  if (list.length === 0) {
    empty.style.display = "block";
    empty.querySelector("p").textContent = "No saved recipes yet.";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = list
    .map(
      r => `
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


/* ============================================
   UPLOAD RECIPE FORM + SUCCESS
============================================ */
function initUploadForm() {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const user = getUser();
    if (!user) {
      window.location.href = "sign-in.html";
      return;
    }

    const title = document.getElementById("recipeTitle").value.trim();
    const desc = document.getElementById("recipeDesc").value.trim();
    const imageUrl = document.getElementById("recipeImage").value.trim();

    if (!title || !desc || !imageUrl) {
      alert("Please fill all required fields.");
      return;
    }

    const key = getCookbookKey();
    let list = JSON.parse(localStorage.getItem(key) || "[]");

    const recipeId = "recipe-" + Date.now();

    list.push({
      id: recipeId,
      title,
      author: user.name || user.email,
      image: imageUrl
    });

    localStorage.setItem(key, JSON.stringify(list));

    // Success animation
    const overlay = document.getElementById("uploadSuccessOverlay");
    overlay.classList.add("show");

    setTimeout(() => {
      overlay.classList.remove("show");
      window.location.href = "browse.html";
    }, 2000);

    form.reset();
  });
}


/* ============================================
   INIT EVERYTHING
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initSignInForm();
  initSignUpForm();
  initForgotForm();
  initResetForm();
  loadCookbookPage();
  initUploadForm();
});


/* ============================================
   POPUP CLOSE EVENTS
============================================ */
document.getElementById("recipeModalClose").addEventListener("click", () => {
  document.getElementById("recipeModal").classList.add("hidden");
});

document.getElementById("recipeModal").addEventListener("click", e => {
  if (e.target.id === "recipeModal") {
    document.getElementById("recipeModal").classList.add("hidden");
  }
});


/* Allow inline button access */
window.addToCookbook = addToCookbook;
window.openRecipePopup = openRecipePopup;
