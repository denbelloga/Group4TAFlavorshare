
// ===== KEYS =====
const USER_KEY = "fs_user";
const THEME_KEY = "fs_theme";

// ===== USER HELPERS =====
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

// ===== THEME =====
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

// ===== NAVBAR STATE =====
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
      const name = user.name && user.name.trim().length
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

// ===== NOTIFICATIONS =====
function initNotifications() {
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
}

// ===== AUTH FORMS =====
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
    // accept ANY password
    const existing = getUser();
    const name = existing?.name || "";
    saveUser({ email, name });
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

// ===== COOKBOOK =====
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
      empty.querySelector("p").textContent = "You haven't saved any recipes yet.";
    }
    return;
  }
  if (empty) empty.style.display = "none";
  grid.innerHTML = list
    .map(
      (r) => `
      <article class="recipe-card"
        onclick="openRecipeModal({
          id: '${r.id}',
          title: '${r.title}',
          author: '${r.author}',
          image: '${r.image}',
          description: 'Your saved recipe from FlavorShare.',
          ingredients: ['Custom recipe (demo).'],
          instructions: ['Open the full app to view full steps.']
        })">
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

// ===== RECIPE MODAL =====
let lastModalRecipe = null;
function openRecipeModal(data) {
  lastModalRecipe = data;
  const overlay = document.getElementById("recipeModal");
  if (!overlay) return;
  const imgEl = document.getElementById("modalImage");
  const titleEl = document.getElementById("modalTitle");
  const authorEl = document.getElementById("modalAuthor");
  const descEl = document.getElementById("modalDescription");
  const ingList = document.getElementById("modalIngredients");
  const instList = document.getElementById("modalInstructions");
  if (imgEl) imgEl.src = data.image;
  if (titleEl) titleEl.textContent = data.title;
  if (authorEl) authorEl.textContent = "by " + data.author;
  if (descEl) descEl.textContent = data.description || "";
  if (ingList) {
    ingList.innerHTML = "";
    (data.ingredients || []).forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing;
      ingList.appendChild(li);
    });
  }
  if (instList) {
    instList.innerHTML = "";
    (data.instructions || []).forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      instList.appendChild(li);
    });
  }
  overlay.classList.add("show");
}
function closeRecipeModal() {
  const overlay = document.getElementById("recipeModal");
  if (overlay) overlay.classList.remove("show");
}
function initRecipeModal() {
  const overlay = document.getElementById("recipeModal");
  if (!overlay) return;
  const closeBtns = document.querySelectorAll(".modal-close");
  closeBtns.forEach((btn) => btn.addEventListener("click", closeRecipeModal));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeRecipeModal();
  });
  const saveBtn = document.getElementById("saveFromModalBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!lastModalRecipe) return;
      addToCookbook(
        lastModalRecipe.id || lastModalRecipe.title,
        lastModalRecipe.title,
        lastModalRecipe.author,
        lastModalRecipe.image
      );
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRecipeModal();
  });
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initNotifications();
  initSignInForm();
  initSignUpForm();
  initForgotForm();
  initResetForm();
  loadCookbookPage();
  initRecipeModal();
});

// expose
window.addToCookbook = addToCookbook;
window.openRecipeModal = openRecipeModal;

// =======================
// EXPLORE RECIPES DATA
// =======================

const exploreRecipes = [
    {
        id: 1,
        title: "Creamy Carbonara",
        image: "images/carbonara.jpg",
        author: "Maria Romano",
        category: "pasta",
        desc: "A silky Italian pasta with eggs, parmesan, and crispy pancetta.",
        ingredients: [
            "200g spaghetti", "2 eggs", "1/2 cup parmesan", "pancetta", "salt & pepper"
        ],
        steps: "Cook pasta, whisk eggs & cheese, mix with pancetta, toss together."
    },
    {
        id: 2,
        title: "Garlic Butter Shrimp",
        image: "images/shrimp.jpg",
        author: "Luis Vega",
        category: "quick",
        desc: "Juicy shrimp cooked in garlic butter with herbs.",
        ingredients: [
            "Shrimp", "Butter", "Garlic", "Paprika", "Parsley"
        ],
        steps: "Sauté garlic in butter, cook shrimp, add herbs, serve warm."
    },
    {
        id: 3,
        title: "Classic Pancakes",
        image: "images/pancakes.jpg",
        author: "Ella Turner",
        category: "dessert",
        desc: "Fluffy, golden pancakes perfect for mornings.",
        ingredients: ["Flour", "Eggs", "Milk", "Sugar", "Butter"],
        steps: "Mix batter, heat pan, cook until golden on both sides."
    },
    {
        id: 4,
        title: "Beef Ramen Bowl",
        image: "images/ramen.jpg",
        author: "Kenji Sato",
        category: "asian",
        desc: "Rich ramen broth with sliced beef, noodles, and veggies.",
        ingredients: ["Ramen noodles", "Broth", "Beef", "Green onions"],
        steps: "Simmer broth, cook noodles, add beef & toppings."
    },
    {
        id: 5,
        title: "BBQ Pulled Pork",
        image: "images/pulledpork.jpg",
        author: "Hank Wilson",
        category: "comfort",
        desc: "Slow-cooked pork with sweet smoky BBQ sauce.",
        ingredients: ["Pork shoulder", "BBQ sauce", "Spices"],
        steps: "Slow cook until tender, shred pork, mix with sauce."
    },
    {
        id: 6,
        title: "Thai Green Curry",
        image: "images/greencurry.jpg",
        author: "Nina Chai",
        category: "asian",
        desc: "Creamy coconut curry with vegetables and chicken.",
        ingredients: ["Coconut milk", "Green curry paste", "Chicken", "Veggies"],
        steps: "Sauté paste, add coconut milk, add chicken & simmer."
    },
    {
        id: 7,
        title: "Blueberry Cheesecake",
        image: "images/cheesecake.jpg",
        author: "Olivia Grace",
        category: "dessert",
        desc: "Rich baked cheesecake with blueberry topping.",
        ingredients: ["Cream cheese", "Sugar", "Eggs", "Blueberries"],
        steps: "Blend filling, bake crust, chill overnight."
    },
    {
        id: 8,
        title: "Chicken Alfredo",
        image: "images/alfredo.jpg",
        author: "Marco DeLuca",
        category: "pasta",
        desc: "Creamy Alfredo sauce tossed with fettuccine.",
        ingredients: ["Fettuccine", "Cream", "Parmesan", "Chicken"],
        steps: "Simmer cream, add cheese, mix pasta & chicken."
    },
    {
        id: 9,
        title: "Honey Soy Salmon",
        image: "images/salmon.jpg",
        author: "Tara Lin",
        category: "quick",
        desc: "Pan-seared salmon glazed in honey and soy.",
        ingredients: ["Salmon", "Honey", "Soy sauce"],
        steps: "Pan-sear salmon, add glaze, cook until caramelized."
    },
    {
        id: 10,
        title: "Molten Chocolate Cake",
        image: "images/molten.jpg",
        author: "Ethan Brooks",
        category: "dessert",
        desc: "Warm cake with gooey chocolate center.",
        ingredients: ["Chocolate", "Butter", "Eggs", "Flour"],
        steps: "Bake lightly so center stays soft."
    },
    {
        id: 11,
        title: "Sushi Rolls",
        image: "images/sushi.jpg",
        author: "Haruto Minami",
        category: "asian",
        desc: "Fresh sushi rolls with rice, seaweed, and toppings.",
        ingredients: ["Rice", "Nori", "Fish", "Veggies"],
        steps: "Prepare rice, roll tightly, slice cleanly."
    },
    {
        id: 12,
        title: "Mac & Cheese",
        image: "images/mac.jpg",
        author: "Grace Kelly",
        category: "comfort",
        desc: "Creamy stovetop mac and cheese.",
        ingredients: ["Macaroni", "Cheese", "Milk", "Butter"],
        steps: "Cook pasta, melt cheese sauce, mix everything."
    }
];


// Render Recipes
function loadExploreRecipes() {
    const grid = document.getElementById("exploreGrid");
    grid.innerHTML = "";

    exploreRecipes.forEach(recipe => {
        const card = `
            <div class="recipe-card" data-category="${recipe.category}" onclick="openRecipeModal(${recipe.id})">
                <img src="${recipe.image}">
                <h3>${recipe.title}</h3>
                <p class="author">by ${recipe.author}</p>
            </div>
        `;
        grid.innerHTML += card;
    });
}

if (document.getElementById("exploreGrid")) {
    loadExploreRecipes();
}

