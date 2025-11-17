/* =========================================================
   FLAVORSHARE - FULL SITE SCRIPT
   Includes:
   ✔ Auth system
   ✔ Dropdown + logout
   ✔ Save to Cookbook
   ✔ Load Cookbook
   ✔ Likes system
   ✔ Dark mode sync
   ✔ Notifications
   ✔ Recipe modal
   ========================================================= */

/* =========================================================
   AUTHENTICATION (SIGN IN / LOGOUT)
   ========================================================= */

function saveUser(username) {
    localStorage.setItem("fs_user", username);
}

function getUser() {
    return localStorage.getItem("fs_user");
}

function logoutUser() {
    localStorage.removeItem("fs_user");
    window.location.href = "sign-in.html";
}

/* Handle navbar username display */
function updateNavbarUser() {
    const user = getUser();
    const signInBtn = document.getElementById("signInBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (!signInBtn || !userDropdown) return;

    if (user) {
        signInBtn.style.display = "none";
        userDropdown.style.display = "flex";
        document.getElementById("usernameDisplay").innerText = user;
    } else {
        signInBtn.style.display = "inline-block";
        userDropdown.style.display = "none";
    }
}

/* Sign In handler */
if (window.location.pathname.includes("sign-in.html")) {
    document.getElementById("signInForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const username = email.split("@")[0];

        saveUser(username);

        document.querySelector(".success-popup").classList.add("show");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}

/* Apply navbar state on load */
document.addEventListener("DOMContentLoaded", updateNavbarUser);


/* =========================================================
   DARK MODE
   ========================================================= */

function applyDarkMode() {
    const enabled = localStorage.getItem("fs_darkmode") === "true";
    document.body.classList.toggle("dark-mode", enabled);
}

function toggleDarkMode() {
    const enabled = document.body.classList.toggle("dark-mode");
    localStorage.setItem("fs_darkmode", enabled);
}

document.addEventListener("DOMContentLoaded", applyDarkMode);


/* =========================================================
   NOTIFICATIONS PANEL
   ========================================================= */

const notifBell = document.getElementById("notifBell");
const notifPanel = document.getElementById("notifPanel");
const notifClose = document.getElementById("notifClose");

if (notifBell) {
    notifBell.addEventListener("click", () => {
        notifPanel.classList.toggle("show");
    });
}

if (notifClose) {
    notifClose.addEventListener("click", () => {
        notifPanel.classList.remove("show");
    });
}


/* =========================================================
   LIKE SYSTEM
   ========================================================= */

function getRecipeLikes(id) {
    return parseInt(localStorage.getItem(`fs_likes_${id}`) || "0");
}

function likeRecipe(id) {
    let likes = getRecipeLikes(id) + 1;
    localStorage.setItem(`fs_likes_${id}`, likes);

    const likeCounter = document.querySelector(`#like-${id}`);
    if (likeCounter) likeCounter.innerText = likes;
}


/* =========================================================
   SAVE TO COOKBOOK
   ========================================================= */

function getCookbook() {
    return JSON.parse(localStorage.getItem("fs_cookbook") || "[]");
}

function saveToCookbook(recipe) {
    let cookbook = getCookbook();

    if (!cookbook.some(r => r.id === recipe.id)) {
        cookbook.push(recipe);
        localStorage.setItem("fs_cookbook", JSON.stringify(cookbook));
        alert("Recipe saved to Cookbook! ❤️");
    } else {
        alert("Already saved!");
    }
}

function removeFromCookbook(id) {
    let updated = getCookbook().filter(r => r.id !== id);
    localStorage.setItem("fs_cookbook", JSON.stringify(updated));
    loadCookbookPage();
}

/* Load cookbook page dynamically */
function loadCookbookPage() {
    const grid = document.getElementById("cookbookGrid");
    const empty = document.getElementById("emptyState");

    if (!grid) return;

    const cookbook = getCookbook();
    grid.innerHTML = "";

    if (cookbook.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    cookbook.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>${recipe.author}</p>
            <button class="remove-btn" onclick="removeFromCookbook('${recipe.id}')">Remove</button>
        `;

        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadCookbookPage);


/* =========================================================
   RECIPE MODAL (HOME + BROWSE)
   ========================================================= */

function openRecipeModal(recipe) {
    const modal = document.getElementById("recipeModal");

    document.getElementById("modalImg").src = recipe.image;
    document.getElementById("modalTitle").innerText = recipe.title;
    document.getElementById("modalAuthor").innerText = recipe.author;
    document.getElementById("modalLikes").innerText = getRecipeLikes(recipe.id);

    document.getElementById("saveBtn").onclick = () => saveToCookbook(recipe);
    document.getElementById("likeBtn").onclick = () => likeRecipe(recipe.id);

    modal.classList.add("show");
}

function closeRecipeModal() {
    document.getElementById("recipeModal").classList.remove("show");
}


/* =========================================================
   EXPORT FUNCTIONS
   ========================================================= */

window.likeRecipe = likeRecipe;
window.saveToCookbook = saveToCookbook;
window.openRecipeModal = openRecipeModal;
window.closeRecipeModal = closeRecipeModal;
window.logoutUser = logoutUser;
window.toggleDarkMode = toggleDarkMode;
