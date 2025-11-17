/* ==========================================================
   FLAVORSHARE — GLOBAL JAVASCRIPT
   Works for: index.html, browse.html, cookbook.html,
   following.html, upload.html, sign-in.html, sign-up.html
   ========================================================== */

/* ======================
     USER LOGIN STATE
   ====================== */

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function isLoggedIn() {
    return localStorage.getItem("user") !== null;
}

/* ======================
      UPDATE NAVBAR
   ====================== */

function updateNavbar() {
    const signInBtn = document.querySelector(".sign-in-btn");
    const uploadBtn = document.querySelector(".upload-btn");
    const bell = document.querySelector(".notif-bell");

    const user = getUser();

    if (signInBtn) {
        if (user) {
            signInBtn.textContent = user.name;
            signInBtn.href = "#";  
            signInBtn.style.background = "#fca311";
            signInBtn.style.color = "white";
            signInBtn.style.padding = "8px 18px";
            signInBtn.style.borderRadius = "20px";

            // Right-click → Sign Out
            signInBtn.oncontextmenu = (e) => {
                e.preventDefault();
                signOut();
            };
        } else {
            signInBtn.textContent = "Sign In";
            signInBtn.href = "sign-in.html";
        }
    }

    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            if (!isLoggedIn()) {
                alert("Please sign in to upload a recipe.");
                window.location.href = "sign-in.html";
            }
        });
    }

    if (bell) {
        bell.addEventListener("click", toggleNotif);
    }
}

/* ======================
       SIGN OUT
   ====================== */
function signOut() {
    if (confirm("Sign out?")) {
        localStorage.removeItem("user");
        window.location.reload();
    }
}

/* ======================
   NOTIFICATION PANEL
   ====================== */

function toggleNotif() {
    const panel = document.getElementById("notif-panel");
    if (panel) panel.classList.toggle("show");
}

/* Close panel when clicking outside */
document.addEventListener("click", (e) => {
    const panel = document.getElementById("notif-panel");
    const bell = document.querySelector(".notif-bell");

    if (!panel || !bell) return;

    if (!panel.contains(e.target) && e.target !== bell) {
        panel.classList.remove("show");
    }
});

/* ======================
  PROTECT PAGES REQUIRING LOGIN
   ====================== */
function protectPage() {
    const restrictedPages = ["cookbook.html", "upload.html", "following.html"];

    const currentPage = window.location.pathname.split("/").pop();

    if (restrictedPages.includes(currentPage) && !isLoggedIn()) {
        alert("You must sign in first.");
        window.location.href = "sign-in.html";
    }
}

/* ======================
     RECIPE MODAL (Explore)
   ====================== */

function openModal(title, details, imageSrc) {
    const modal = document.getElementById("recipeModal");
    if (!modal) return;

    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDetails").textContent = details;
    document.getElementById("modalImg").src = imageSrc;

    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("recipeModal");
    if (modal) modal.style.display = "none";
}

/* Close modal when clicking background */
window.addEventListener("click", function (e) {
    const modal = document.getElementById("recipeModal");
    if (modal && e.target === modal) {
        modal.style.display = "none";
    }
});

/* ======================
   RUN ON EVERY PAGE LOAD
   ====================== */

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    protectPage();
});
