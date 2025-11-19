/* ============================================
   USER / AUTH
============================================ */
const USER_KEY = "fs_user";
const THEME_KEY = "fs_theme";

/* Get / Save User */
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
   RECIPE POPUP DATA (STATIC BROWSE RECIPES)
============================================ */
const recipeData = {
  "creamy-carbonara": {
    title: "Creamy Carbonara",
    author: "Maria Romano",
    image: "images/creamy-carbonara-1-4.jpg",
    description: "A silky Italian pasta with eggs, parmesan, and crispy pancetta.",
    ingredients: [
      "200g spaghetti",
      "2 eggs",
      "1/2 cup parmesan cheese",
      "Pancetta or bacon",
      "Salt and pepper"
    ],
    steps: [
      "Boil pasta until al dente.",
      "Cook pancetta until crispy.",
      "Mix eggs and parmesan.",
      "Combine everything with pasta.",
      "Serve warm."
    ]
  },

  "rainbow-cupcakes": {
    title: "Rainbow Cupcakes",
    author: "Emma Baker",
    image: "images/rainbow-cupcakes-17.jpg",
    description: "Colorful, fun cupcakes perfect for birthdays and parties.",
    ingredients: ["Flour", "Butter", "Sugar", "Eggs", "Food coloring"],
    steps: ["Mix batter", "Split and color", "Fill cups", "Bake"]
  },

  "thai-green-curry": {
    title: "Thai Green Curry",
    author: "Alex Chen",
    image: "images/Thai-Green-Curry-square-FS.jpg",
    description: "A rich Thai curry with coconut milk, chicken, and herbs.",
    ingredients: ["Chicken", "Coconut Milk", "Green Curry Paste", "Vegetables"],
    steps: ["Cook chicken", "Add curry paste", "Add coconut milk", "Simmer"]
  }
};

/* Open default browse recipe popup */
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
    const next = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    toggle.textContent = next === "dark" ? "☀️ Light" : "🌙 Dark";
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

  /* Show logged-in state */
  if (user) {
    signInBtn?.style && (signInBtn.style.display = "none");
    userMenu?.classList.remove("hidden");
    userNameDisplay.textContent = user.name || user.email.split("@")[0];
  } else {
    signInBtn?.style && (signInBtn.style.display = "inline-block");
    userMenu?.classList.add("hidden");
  }

  /* Gate pages */
  if (protectCookbook) {
    protectCookbook.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      }
    });
  }

  if (protectFollowing) {
    protectFollowing.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      }
    });
  }

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

  /* Dropdown toggle */
  userMenu?.addEventListener("click", () => {
    userDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (ev) => {
    if (userMenu && !userMenu.contains(ev.target)) {
      userDropdown.classList.add("hidden");
    }
  });

  logoutBtn?.addEventListener("click", logoutUser);
}

/* ============================================
   NOTIFICATIONS
============================================ */
function initNotifications() {
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  const closeBtn = document.getElementById("notifClose");

  bell?.addEventListener("click", () => {
    panel.classList.toggle("show");
  });

  closeBtn?.addEventListener("click", () => {
    panel.classList.remove("show");
  });
}

/* ============================================
   AUTH FORMS
============================================ */
function initSignInForm() {
  const form = document.getElementById("signInForm");
  if (!form) return;

  const errorEl = document.getElementById("signInError");

  form.addEventListener("submit", (e) => {
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

  form.addEventListener("submit", (e) => {
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
  if (!user) return null;
  return "fs_cookbook_" + user.email;
}

/* Save from browse recipes */
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
    alert("Already saved!");
  }
}

/* Load My Cookbook Page */
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

  const key = getCookbookKey();
  let list = JSON.parse(localStorage.getItem(key) || "[]");

  if (list.length === 0) {
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Your cookbook is empty.";
    return;
  }

  empty.style.display = "none";

  grid.innerHTML = list
    .map(
      (r) => `
      <article class="recipe-card" onclick="openSavedRecipe('${r.id}')">
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

/* Open uploaded / saved recipe */
function openSavedRecipe(id) {
  const key = getCookbookKey();
  let list = JSON.parse(localStorage.getItem(key) || "[]");
  const recipe = list.find(r => r.id === id);

  if (!recipe) return;

  document.getElementById("modalImage").src = recipe.image;
  document.getElementById("modalTitle").textContent = recipe.title;
  document.getElementById("modalAuthor").textContent = "by " + recipe.author;

  document.getElementById("modalDescription").textContent =
    recipe.description || "No description provided.";

  document.getElementById("modalIngredients").innerHTML =
    recipe.ingredients
      ? recipe.ingredients.split("\n").map(i => `<li>${i}</li>`).join("")
      : "<li>No ingredients provided.</li>";

  document.getElementById("modalSteps").innerHTML =
    recipe.steps
      ? recipe.steps.split("\n").map(s => `<li>${s}</li>`).join("")
      : "<li>No steps provided.</li>";

  document.getElementById("recipeModal").classList.remove("hidden");
}

/* ============================================
   UPLOAD FORM
============================================ */
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

    const title = document.getElementById("recipeTitle").value.trim();
    const desc = document.getElementById("recipeDesc").value.trim();
    const imageUrl = document.getElementById("recipeImage").value.trim();
    const ingredients = document.getElementById("recipeIngredients").value.trim();
    const steps = document.getElementById("recipeSteps").value.trim();

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
      image: imageUrl,
      description: desc,
      ingredients,
      steps
    });

    localStorage.setItem(key, JSON.stringify(list));

    /* Success Animation */
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
   INIT ALL
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initSignInForm();
  initSignUpForm();
  loadCookbookPage();
  initUploadForm();
});

/* Close Recipe Modal */
document.getElementById("recipeModalClose")?.addEventListener("click", () => {
  document.getElementById("recipeModal").classList.add("hidden");
});

document.getElementById("recipeModal")?.addEventListener("click", (e) => {
  if (e.target.id === "recipeModal") {
    document.getElementById("recipeModal").classList.add("hidden");
  }
});

/* Allow inline onclick() */
window.addToCookbook = addToCookbook;
window.openSavedRecipe = openSavedRecipe;
