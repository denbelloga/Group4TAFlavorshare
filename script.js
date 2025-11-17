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
    if (signupModal) {
      signupModal.classList.remove('hidden');
    }
  }

  function hideModal() {
    if (signupModal) {
      signupModal.classList.add('hidden');
    }
  }

  function handleRestrictedClick(url) {
    if (isLoggedIn()) {
      window.location.href = url;
    } else {
      showModal();
    }
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', e => {
      e.preventDefault();
      handleRestrictedClick('upload.html');
    });
  }

  if (cookbookBtn) {
    cookbookBtn.addEventListener('click', e => {
      e.preventDefault();
      handleRestrictedClick('my-cookbook.html');
    });
  }

  if (followingBtn) {
    followingBtn.addEventListener('click', e => {
      e.preventDefault();
      handleRestrictedClick('following.html');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }

  if (signupModal) {
    signupModal.addEventListener('click', e => {
      if (e.target === signupModal) hideModal();
    });
  }

  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', () => {
      window.location.href = 'sign-up.html';
    });
  }
});
