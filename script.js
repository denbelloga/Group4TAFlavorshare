/* ============================================================
   FLAVORSHARE – GLOBAL SCRIPT.JS
   Handles:
   - Login system (ANY PASSWORD allowed)
   - User dropdown menu
   - Protected pages
   - Save to Cookbook
   - Notifications
   - Recipe modal
   ============================================================ */

/* ------------------ USER DATA STORAGE ------------------ */

// Get all registered users
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

// Save user list
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Get active user's email
function getActiveUserEmail() {
    return localStorage.getItem("activeUser");
}

// Set active user (logged in)
function setActiveUserEmail(email) {
    localStorage.setItem("activeUser", email);
}

// Log out
function logoutUser() {
    localStorage.removeItem("activeUser");
    window.location.href = "index.html";
}

// Get active user data
function getActiveUser() {
    const email = getActiveUserEmail();
    if (!email) return null;
    return getUsers().find(u => u.email === email) || null;
}


/* ------------------ NAVBAR USER UI ------------------ */

function setupNavbarUserState() {
    const usernameBtn = document.getElementById("usernameBtn");
    const signInBtn = document.getElementById("signInBtn");
    const dropdown = document.getElementById("userDropdown");

    if (!usernameBtn || !signInBtn) return;

    const user = getActiveUser();

    if (user) {
        signInBtn.style.display = "none";
        usernameBtn.style.display = "inline-block";
        usernameBtn.textContent = user.username;

        usernameBtn.addEventListener("click", () => {
            dropdown.classList.toggle("show");
        });
    } else {
        usernameBtn.style.display = "none";
        signInBtn.style.display = "inline-block";
    }
}


/* ------------------ SIGN UP FORM ------------------ */

function setupSignUpForm() {
    const form = document.getElementById("signUpForm");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const username = form.username.value.trim();
        const email = form.email.value.trim();

        let users = getUsers();

        if (users.find(u => u.email === email)) {
            alert("An account with this email already e
