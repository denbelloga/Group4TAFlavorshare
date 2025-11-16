document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      // You can add filtering logic here later.

      // Simple login simulation: for demo, user is logged in if localStorage 'loggedIn' === 'true'
function isLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
  // Get buttons and modal elements
  const uploadBtn = document.getElementById('uploadBtn');
  const cookbookBtn = document.getElementById('cookbookBtn');
  const followingBtn = document.getElementById('followingBtn');
  const signupModal = document.getElementById('signupModal');
  const closeModalBtn = document.getElementById('closeModal');
  const createAccountBtn = document.getElementById('createAccountBtn');

  // Function to show modal
  function showModal() {
    signupModal.classList.remove('hidden');
  }

  // Function to hide modal
  function hideModal() {
    signupModal.classList.add('hidden');
  }

  // When user clicks upload / cookbook / following
  function handleRestrictedClick(url) {
    if (isLoggedIn()) {
      // If logged in, navigate to url
      window.location.href = url;
    } else {
      // If not logged in, show create account modal
      showModal();
    }
  }

  // Attach event listeners
  uploadBtn.addEventListener('click', e => {
    e.preventDefault();
    handleRestrictedClick('upload.html');
  });

  cookbookBtn.addEventListener('click', e => {
    e.preventDefault();
    handleRestrictedClick('cookbook.html');
  });

  followingBtn.addEventListener('click', e => {
    e.preventDefault();
    handleRestrictedClick('following.html');
  });

  closeModalBtn.addEventListener('click', hideModal);

  // Clicking outside modal content closes modal
  signupModal.addEventListener('click', e => {
    if (e.target === signupModal) hideModal();
  });

  // When "Create an Account" clicked
  createAccountBtn.addEventListener('click', () => {
    window.location.href = 'sign-in.html';
  });
});
    });
  });
});
