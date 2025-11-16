// Global functions for all pages

// Password toggle
function togglePassword() {
    const pwd = document.getElementById('password') || document.getElementById('signUpPassword');
    if (pwd) {
        pwd.type = pwd.type === 'password' ? 'text' : 'password';
        const btn = document.getElementById('togglePassword');
        if (btn) btn.textContent = pwd.type === 'password' ? 'Show' : 'Hide';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) toggleBtn.addEventListener('click', togglePassword);
});

// Sign-in validation
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = '';

        if (!email.endsWith('@gmail.com')) {
            errorDiv.textContent = 'Email must be a @gmail.com address.';
            return;
        }
        // Mock success for any @gmail.com + password
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'landing-page.html';
    });
}

// Sign-up toggle and validation
const showSignUp = document.getElementById('showSignUp');
if (showSignUp) {
    showSignUp.addEventListener('click', () => {
         document.getElementById('signUpForm').style.display = 'block';
    });
}
const signUpBtn = document.getElementById('signUpBtn');
if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const errorDiv = document.getElementById('signUpError');
        errorDiv.textContent = '';

        if (!email.endsWith('@gmail.com')) {
            errorDiv.textContent = 'Please use a valid @gmail.com email.';
            return;
        }
        alert('Account created!');
        document.getElementById('signUpForm').style.display = 'none';
    });
}

// Upload form validation
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();
        const errorDiv = document.getElementById('uploadError');
        errorDiv.textContent = '';

        if (!title || !description || !ingredients) {
            errorDiv.textContent = 'All fields are required.';
            return;
        }
        alert('Recipe uploaded successfully!');
    });
}

// Modal functions for browse page
function openModal(title, details) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDetails').textContent = details;
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};

// Update nav based on login status
window.addEventListener('load', () => {
    const loggedIn = localStorage.getItem('loggedIn');
    const signInLink = document.getElementById('signInLink');
    if (signInLink
