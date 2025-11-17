/* ==========================
   LOGIN SYSTEM
========================== */

function getUser() {
  const user = localStorage.getItem("fs_user");
  return user ? JSON.parse(user) : null;
}

function saveUser(userObj) {
  localStorage.setItem("fs_user", JSON.stringify(userObj));
}

function logoutUser() {
  localStorage.removeItem("fs_user");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();

  const signInBtn = document.getElementById("signInBtn");
  const userMenu = document.getElementById("userMenu");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const userDropdown = document.getElementById("userDropdown");

  const protectCookbook = document.getElementById("protectCookbook");
  const protectFollowing = document.getElementById("protectFollowing");
  const uploadBtn = document.getElementById("uploadBtn");

  /* ==========================
      SHOW USER STATE
  =========================== */
  if (user) {
    if (signInBtn) signInBtn.style.display = "none";

    if (userMenu) {
      userMenu.classList.remove("hidden");
      userNameDisplay.textContent = user.email.split("@")[0];
    }
  }

  /* ==========================
      REQUIRE LOGIN FOR PAGES
  =========================== */
  function requireLogin(url) {
    if (!user) {
      alert("You must sign in first.");
      window.location.href = "sign-in.html";
    } else {
      window.location.href = url;
    }
  }

  if (protectCookbook)
    protectCookbook.addEventListener("click", (e) => {
      e.preventDefault();
      requireLogin("my-cookbook.html");
    });

  if (protectFollowing)
    protectFollowing.addEventListener("click", (e) => {
      e.preventDefault();
      requireLogin("following.html");
    });

  if (uploadBtn)
    uploadBtn.addEventListener("click", () =>
      requireLogin("upload.html")
    );

  /* USER DROPDOWN */
  if (userMenu) {
    userMenu.addEventListener("click", () => {
      userDropdown.classList.toggle("hidden");
    });
  }

  /* LOGOUT */
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  /* ==========================
      SIGN IN FORM
  =========================== */
  const signInForm = document.getElementById("signInForm");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = signInForm.email.value.trim();
      const password = signInForm.password.value.trim();

      if (!email || !password) return;

      // Accept ANY email and password
      saveUser({ email: email });

      window.location.href = "index.html";
    });
  }

  /* NOTIFICATIONS */
  const notifBell = document.getElementById("notifBell");
  const notifPanel = document.getElementById("notifPanel");
  const notifClose = document.getElementById("notifClose");

  if (notifBell && notifPanel) {
    notifBell.addEventListener("click", () => {
      notifPanel.classList.toggle("show");
    });
  }

  if (notifClose) {
    notifClose.addEventListener("click", () => {
      notifPanel.classList.remove("show");
    });
  }
});
