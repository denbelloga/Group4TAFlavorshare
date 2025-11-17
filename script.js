function isLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const cookbookBtn = document.getElementById('cookbookBtn');
  const followingBtn = document.getElementById('followingBtn');
  const signupModal = document.getElementById('signupModal');
  const closeModalBtn = document.getElementById('closeModal');
  const createAccountBtn = document.getElementById('createAccountBtn');

  function showModal() {
    signupModal.classList.remove('hidden');
  }

  function hideModal() {
    signupModal.classList.add('hidden');
  }

  function handleRestrictedClick(url) {
    if (isLoggedIn()) {
      window.location.href = url;
    } else {
      showModal();
    }
  }

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

  signupModal.addEventListener('click', e => {
    if (e.target === signupModal) hideModal();
  });

  createAccountBtn.addEventListener('click', () => {
    window.location.href = 'sign-in.html';

    document.addEventListener('DOMContentLoaded', () => {
  const signupModal = document.getElementById('signupModal');
  const closeModalBtn = document.getElementById('closeModal');
  const createAccountBtn = document.getElementById('createAccountBtn');

  // Function to show modal (call this when needed)
  function showModal() {
    signupModal.classList.remove('hidden');
  }

  // Function to hide modal
  function hideModal() {
    signupModal.classList.add('hidden');
  }

  // Close button event
  closeModalBtn.addEventListener('click', hideModal);

  // Click outside modal content closes modal
  signupModal.addEventListener('click', (event) => {
    if (event.target === signupModal) {
      hideModal();
    }
  });

  // Create Account button goes to sign-in page
  createAccountBtn.addEventListener('click', () => {
    window.location.href = 'sign-in.html';
  });

  // For demo: Show modal after 2 seconds (remove this for production)
  // setTimeout(showModal, 2000);

      createAccountBtn.addEventListener('click', () => {
  window.location.href = 'sign-up.html';
});
});
  });
});
