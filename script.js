document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active on clicked
      button.classList.add('active');

      // Here is where you can filter recipes by category
      // For now, no filtering logic is included since this is static
    });
  });
});
