// Notification panel toggle
document.addEventListener('DOMContentLoaded', () => {
  const bell = document.getElementById('notifBell');
  const panel = document.getElementById('notifPanel');
  const close = document.getElementById('notifClose');

  if (bell && panel) {
    bell.addEventListener('click', () => {
      panel.classList.toggle('show');
    });
  }

  if (close && panel) {
    close.addEventListener('click', () => {
      panel.classList.remove('show');
    });
  }

  if (panel) {
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== bell) {
        panel.classList.remove('show');
      }
    });
  }
});

// Simple recipe modal for browse page
function openModal(title, details) {
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modalTitle');
  const detailsEl = document.getElementById('modalDetails');

  if (!modal) return;

  titleEl.textContent = title;
  detailsEl.textContent = details;
  modal.classList.add('show');
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('show');
    });
  }
});
