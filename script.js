document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // Enable links normally disabled before login
    const myCookbookLink = document.querySelector('nav a[href="my-profile.html"]');
    const followingLink = document.querySelector('nav a[href="following.html"]');
    if (myCookbookLink) {
      myCookbookLink.style.pointerEvents = 'auto';
      myCookbookLink.style.opacity = '1';
    }
    if (followingLink) {
      followingLink.style.pointerEvents = 'auto';
      followingLink.style.opacity = '1';
    }

    // Hide Sign In link
    const signInLink = document.querySelector('a[href="sign-in.html"]');
    if (signInLink) signInLink.style.display = 'none';

    // Optionally show a user-pill or greeting
    const userPillContainer = document.getElementById('userPillContainer');
    if (userPillContainer) {
      userPillContainer.innerHTML = `<span class="font-semibold text-[#E4572E]">Hi, ${user.name}</span>`;
    }
  }
});
