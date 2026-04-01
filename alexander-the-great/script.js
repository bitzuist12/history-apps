/* ============================================
   History Book - Page Navigation & Interactions
   ============================================ */

let currentSpread = 0;
const totalSpreads = 4;

function openBook() {
  const cover = document.getElementById('bookCover');
  const book = document.getElementById('book');

  cover.style.transition = 'transform 0.6s ease, opacity 0.4s ease';
  cover.style.transform = 'rotateY(-90deg) scale(0.9)';
  cover.style.opacity = '0';

  setTimeout(() => {
    cover.style.display = 'none';
    book.style.display = 'flex';
    updateNavigation();
    buildPageIndicator();
  }, 400);
}

function goToSpread(index) {
  if (index < 0 || index >= totalSpreads || index === currentSpread) return;

  const spreads = document.querySelectorAll('.spread');
  const currentEl = spreads[currentSpread];
  const nextEl = spreads[index];

  // Animate out
  currentEl.classList.add('turning-out');

  setTimeout(() => {
    currentEl.classList.remove('active', 'turning-out');
    nextEl.classList.add('active', 'turning-in');
    currentSpread = index;
    updateNavigation();

    setTimeout(() => {
      nextEl.classList.remove('turning-in');
    }, 300);
  }, 280);
}

function nextPage() {
  goToSpread(currentSpread + 1);
}

function prevPage() {
  goToSpread(currentSpread - 1);
}

function updateNavigation() {
  document.getElementById('prevBtn').disabled = currentSpread === 0;
  document.getElementById('nextBtn').disabled = currentSpread === totalSpreads - 1;

  // Update dots
  document.querySelectorAll('.page-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSpread);
  });
}

function buildPageIndicator() {
  const indicator = document.getElementById('pageIndicator');
  indicator.innerHTML = '';
  for (let i = 0; i < totalSpreads; i++) {
    const dot = document.createElement('div');
    dot.className = 'page-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSpread(i);
    indicator.appendChild(dot);
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (document.getElementById('book').style.display === 'none') {
    if (e.key === 'Enter' || e.key === ' ') openBook();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});

// Touch swipe navigation
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (document.getElementById('book').style.display === 'none') return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Only trigger if horizontal swipe is dominant
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) nextPage();
    else prevPage();
  }
}, { passive: true });
