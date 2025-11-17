/* =========================================================
   GLOBAL VARIABLES
========================================================= */

const exploreGrid = document.getElementById("exploreGrid");
const recipeModal = document.getElementById("recipeModal");
const modalContent = document.getElementById("modalContent");
const closeRecipeModal = document.getElementById("closeRecipeModal");

const darkModeToggle = document.getElementById("darkModeToggle");
const savedUser = JSON.parse(localStorage.getItem("flavorUser")) || null;

let currentUser = savedUser;

/* =========================================================
   HEADER LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  applyDarkMode();
  protectPrivatePages();
  loadExploreRecipes();
});

/* Load header.html dynamically */
function loadHeader() {
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      setupHeaderFunctions();
    });
}

/* Handle header buttons after loading */
function setupHeaderFunctions() {
  const signInBtn = document.querySelector(".sign-in-btn");
  const profileMenu = document.getElementById("profileMenu");
  const profileName = document.getElementById("profileName");

  if (currentUser) {
    signInBtn.style.display = "none";
    profileMenu.style.display = "block";
    profileName.textContent = currentUser.username;
  }

  // Dropdown toggle
  const profileToggle = document.getElementById("profileToggle");
  const dropdown = document.getElementById("profileDropdown");

  if (profileToggle) {
    profileToggle.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Dark mode toggle
  const darkToggle = document.getElementById("darkModeToggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", toggleDarkMode);
  }

  // Notifications
  const notifBell = document.getElementById("notifBell");
  const notifPanel = document.getElementById("notifPanel");
  const notifClose = document.getElementById("notifClose");

  if (notifBell) {
    notifBell.onclick = () => notifPanel.classList.add("show");
  }
  if (notifClose) {
    notifClose.onclick = () => notifPanel.classList.remove("show");
  }
}

/* =========================================================
   DARK MODE SYSTEM
========================================================= */

function applyDarkMode() {
  const mode = localStorage.getItem("flavorDarkMode") || "light";
  document.body.setAttribute("data-theme", mode);
}

function toggleDarkMode() {
  const current = document.body.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";

  document.body.setAttribute("data-theme", next);
  localStorage.setItem("flavorDarkMode", next);
}

/* =========================================================
   ACCESS PROTECTION (My Cookbook / Following)
========================================================= */
function protectPrivatePages() {
  const privatePages = ["my-cookbook.html", "following.html"];

  const currentPage = window.location.pathname.split("/").pop();

  if (privatePages.includes(currentPage) && !currentUser) {
    alert("Please sign in to view this page.");
    window.location.href = "sign-in.html";
  }
}

/* =========================================================
   SIGN IN / SIGN UP / LOGOUT
========================================================= */

function handleLogin(email, username) {
  const user = { username, email };
  localStorage.setItem("flavorUser", JSON.stringify(user));
  currentUser = user;

  window.location.href = "index.html";
}

function handleLogout() {
  localStorage.removeItem("flavorUser");
  window.location.href = "index.html";
}

/* =========================================================
   EXPLORE PAGE RECIPE DATA
========================================================= */

const demoRecipes = [
  {
    id: 1,
    title: "Creamy Carbonara",
    author: "Maria Romano",
    category: "pasta",
    image: "https://i.imgur.com/Dp0YQht.jpeg",
    desc: "A silky Italian pasta with eggs, parmesan and pancetta.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black Pepper"]
  },
  {
    id: 2,
    title: "Garlic Butter Shrimp",
    author: "Luis Vega",
    category: "quick",
    image: "https://i.imgur.com/tflkJ2M.jpeg",
    desc: "Juicy shrimp simmered in garlic butter sauce.",
    ingredients: ["Shrimp", "Butter", "Garlic", "Lemon"]
  },
  {
    id: 3,
    title: "Classic Pancakes",
    author: "Ella Turner",
    category: "dessert",
    image: "https://i.imgur.com/eZq2Tzv.jpeg",
    desc: "Soft and fluffy pancakes perfect for breakfast.",
    ingredients: ["Flour", "Milk", "Eggs", "Sugar"]
  },
  {
    id: 4,
    title: "Beef Ramen Bowl",
    author: "Kenji Sato",
    category: "asian",
    image: "https://i.imgur.com/RTv4e2i.jpeg",
    desc: "A comforting Japanese noodle soup with beef.",
    ingredients: ["Ramen", "Beef", "Soy Sauce", "Egg"]
  }
];

/* =========================================================
   LOAD RECIPES INTO EXPLORE PAGE
========================================================= */

function loadExploreRecipes() {
  if (!exploreGrid) return;

  exploreGrid.innerHTML = "";

  demoRecipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.setAttribute("data-category", recipe.category);

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="recipe-card-info">
        <h3>${recipe.title}</h3>
        <p>by ${recipe.author}</p>
      </div>
    `;

    card.addEventListener("click", () => openRecipeModal(recipe));
    exploreGrid.appendChild(card);
  });

  setupFilters();
}

/* =========================================================
   FILTERING
========================================================= */

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      filterRecipes(category);
    });
  });
}

function filterRecipes(category) {
  const cards = document.querySelectorAll(".recipe-card");

  cards.forEach(card => {
    const match = category === "all" || card.dataset.category === category;
    card.style.display = match ? "block" : "none";
  });
}

/* =========================================================
   RECIPE MODAL
========================================================= */

function openRecipeModal(recipe) {
  modalContent.innerHTML = `
    <img src="${recipe.image}">
    <div class="modal-inner">
      <h2>${recipe.title}</h2>
      <p><strong>by ${recipe.author}</strong></p>

      <h3>About this recipe</h3>
      <p>${recipe.desc}</p>

      <h3>Ingredients</h3>
      <ul>
        ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `;

  recipeModal.classList.add("show");
}

if (closeRecipeModal) {
  closeRecipeModal.addEventListener("click", () => {
    recipeModal.classList.remove("show");
  });
}

/* =========================================================
   SAVE TO COOKBOOK SYSTEM
========================================================= */

function saveRecipe(recipeId) {
  if (!currentUser) {
    alert("Please sign in first.");
    return;
  }

  let saved = JSON.parse(localStorage.getItem("cookbook")) || [];

  if (!saved.includes(recipeId)) {
    saved.push(recipeId);
    localStorage.setItem("cookbook", JSON.stringify(saved));
    alert("Recipe saved to your cookbook!");
  }
}

/* =========================================================
   UPLOAD RECIPE PREVIEW
========================================================= */

function handleImagePreview(input, previewId) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById(previewId).src = reader.result;
  };
  reader.readAsDataURL(file);
}
