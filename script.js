document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      // You can add filtering logic here later.
    });
  });
});
