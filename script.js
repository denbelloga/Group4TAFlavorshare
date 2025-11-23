/* ============================================
   CONSTANTS / HELPERS
============================================ */
const USER_KEY = "fs_user";
const THEME_KEY = "fs_theme";

const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

/* ============================================
   USER / AUTH
============================================ */
const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "null");
const saveUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));

function logoutUser() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "index.html";
}

/* ============================================
   STATIC BROWSE RECIPES (PRE-MADE)
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

/* ============================================
   RECIPE POPUP (STATIC + SAVED)
============================================ */
function fillModal({ image, title, author, description, ingredients, steps }) {
  qs("#modalImage").src = image;
  qs("#modalTitle").textContent = title;
  qs("#modalAuthor").textContent = "by " + author;
  qs("#modalDescription").textContent = description || "No description provided.";

  qs("#modalIngredients").innerHTML = Array.isArray(ingredients)
    ? ingredients.map(i => `<li>${i}</li>`).join("")
    : ingredients
      ? ingredients.split("\n").map(i => `<li>${i}</li>`).join("")
      : "<li>No ingredients provided</li>";

  qs("#modalSteps").innerHTML = Array.isArray(steps)
    ? steps.map(s => `<li>${s}</li>`).join("")
    : steps
      ? steps.split("\n").map(s => `<li>${s}</li>`).join("")
      : "<li>No steps provided</li>";

  qs("#recipeModal").classList.remove("hidden");
}

function openRecipePopup(id) {
  if (recipeData[id]) fillModal(recipeData[id]);
}

function openSavedRecipe(id) {
  const list = JSON.parse(localStorage.getItem(getCookbookKey()) || "[]");
  const recipe = list.find((r) => r.id === id);
  if (recipe) fillModal(recipe);
}

/* ============================================
   THEME / DARK MODE
============================================ */
function initTheme() {
  const toggle = qs("#themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem(THEME_KEY) || "light";
  document.body.classList.toggle("dark-mode", saved === "dark");

  toggle.textContent = saved === "dark" ? "☀️ Light" : "🌙 Dark";

  toggle.addEventListener("click", () => {
    const newMode = document.body.classList.contains("dark-mode")
      ? "light"
      : "dark";

    document.body.classList.toggle("dark-mode");
    toggle.textContent = newMode === "dark" ? "☀️ Light" : "🌙 Dark";
    localStorage.setItem(THEME_KEY, newMode);
  });
}

/* ============================================
   NAVBAR
============================================ */
function initNavbar() {
  const user = getUser();

  const signInBtn = qs("#signInBtn");
  const userMenu = qs("#userMenu");
  const userNameDisplay = qs("#userNameDisplay");
  const dropdown = qs("#userDropdown");

  if (user) {
    signInBtn?.style && (signInBtn.style.display = "none");
    userMenu?.classList.remove("hidden");
    userNameDisplay.textContent = user.name || user.email.split("@")[0];
  } else {
    signInBtn?.style && (signInBtn.style.display = "inline-block");
    userMenu?.classList.add("hidden");
  }

  qsa("#protectCookbook,#protectFollowing").forEach((el) =>
    el?.addEventListener("click", (e) => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "sign-in.html";
      }
    })
  );

  qs("#uploadBtn")?.addEventListener("click", (e) => {
    if (!getUser()) {
      e.preventDefault();
      window.location.href = "sign-in.html";
    } else {
      window.location.href = "upload.html";
    }
  });

  userMenu?.addEventListener("click", () =>
    dropdown.classList.toggle("hidden")
  );

  document.addEventListener("click", (e) => {
    if (userMenu && !userMenu.contains(e.target)) dropdown.classList.add("hidden");
  });

  qs("#logoutBtn")?.addEventListener("click", logoutUser);
}

/* ============================================
   NOTIFICATIONS
============================================ */
function initNotifications() {
  const bell = qs("#notifBell");
  const panel = qs("#notifPanel");
  const closeBtn = qs("#notifClose");

  bell?.addEventListener("click", () => panel.classList.toggle("show"));
  closeBtn?.addEventListener("click", () => panel.classList.remove("show"));
}

/* ============================================
   AUTH FORMS
============================================ */
function initAuthForms() {
  const signIn = qs("#signInForm");
  const signUp = qs("#signUpForm");

  if (signIn) {
    const error = qs("#signInError");
    signIn.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signIn.email.value.trim();

      if (!email.endsWith("@gmail.com"))
        return (error.textContent = "Use a @gmail.com email.");

      saveUser({ email, name: "" });
      window.location.href = "index.html";
    });
  }

  if (signUp) {
    signUp.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signUp.email.value.trim();

      if (!email.endsWith("@gmail.com"))
        return alert("Use a @gmail.com email.");

      saveUser({ email, name: signUp.name.value.trim() });
      window.location.href = "index.html";
    });
  }
}

/* ============================================
   COOKBOOK STORAGE
============================================ */
const getCookbookKey = () =>
  getUser() ? `fs_cookbook_${getUser().email}` : null;

function addToCookbook(id, title, author, image) {
  const user = getUser();
  if (!user) return (window.location.href = "sign-in.html");

  const key = getCookbookKey();
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  if (!list.some((r) => r.id === id)) {
    list.push({ id, title, author, image });
    localStorage.setItem(key, JSON.stringify(list));
    alert("Saved!");
  } else alert("Already saved!");
}

function loadCookbookPage() {
  const grid = qs("#cookbookGrid");
  const empty = qs("#cookbookEmpty");
  if (!grid) return;

  const user = getUser();
  if (!user) {
    empty.style.display = "block";
    empty.querySelector("p").textContent = "Sign in to view your cookbook.";
    return;
  }

  const list = JSON.parse(localStorage.getItem(getCookbookKey()) || "[]");

  if (!list.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  grid.innerHTML = list
    .map(
      (r) => `
      <article class="recipe-card" onclick="openSavedRecipe('${r.id}')">
        <img src="${r.image}">
        <div class="info">
          <h3>${r.title}</h3>
          <p class="author">${r.author}</p>
        </div>
      </article>`
    )
    .join("");
}

/* ============================================
   UPLOAD FORM
============================================ */
function initUploadForm() {
  const form = qs("#uploadForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const key = getCookbookKey();
    const list = JSON.parse(localStorage.getItem(key) || "[]");

    const recipe = {
      id: "recipe-" + Date.now(),
      title: qs("#recipeTitle").value.trim(),
      description: qs("#recipeDesc").value.trim(),
      image: qs("#recipeImage").value.trim(),
      ingredients: qs("#recipeIngredients").value.trim(),
      steps: qs("#recipeSteps").value.trim(),
      author: getUser().name || getUser().email
    };

    list.push(recipe);
    localStorage.setItem(key, JSON.stringify(list));

    const overlay = qs("#uploadSuccessOverlay");
    overlay.classList.add("show");

    setTimeout(() => {
      overlay.classList.remove("show");
      window.location.href = "browse.html";
    }, 2000);

    form.reset();
  });
}

/* ============================================
   MODAL CLOSE BEHAVIOR
============================================ */
qs("#recipeModalClose")?.addEventListener("click", () =>
  qs("#recipeModal").classList.add("hidden")
);

qs("#recipeModal")?.addEventListener("click", (e) => {
  if (e.target.id === "recipeModal")
    qs("#recipeModal").classList.add("hidden");
});

/* ============================================
   INIT ALL
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initAuthForms();
  loadCookbookPage();
  initUploadForm();
});

/* Allow inline onclick */
window.addToCookbook = addToCookbook;
window.openSavedRecipe = openSavedRecipe;
window.openRecipePopup = openRecipePopup;
