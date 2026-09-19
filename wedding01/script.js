function checkGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('name');

  if (guestName) {
    const cleanName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    const guestGreeting = document.getElementById('guestGreeting');
    if (guestGreeting) guestGreeting.innerText = `Dear ${cleanName},`;

    const rsvpInput = document.getElementById('rsvpNameInput');
    if (rsvpInput) rsvpInput.value = cleanName;
  }
}

function createPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const symbols = ['🌿', '🍃', '🤍', '✨', '🌱'];
  const totalPetals = 15;

  for (let i = 0; i < totalPetals; i++) {
    const petal = document.createElement('span');
    petal.classList.add('petal');
    petal.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    const size = Math.random() * 15 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 5;

    petal.style.fontSize = `${size}px`;
    petal.style.left = `${left}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);
  }
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-animate').forEach((el) => {
    observer.observe(el);
  });
}

const screenLoader = document.getElementById('screen-loader');
const screenEnvelope = document.getElementById('screen-envelope');
const screenWelcome = document.getElementById('screen-welcome');
const screenCalendar = document.getElementById('screen-calendar');
const screenStory = document.getElementById('screen-story');
const screenMain = document.getElementById('screen-main');
const playBtn = document.getElementById('playBtn');
const bgMusic = document.getElementById('bg-music');
const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

function showScreen(hideElem, showElem) {
  if (hideElem) {
    hideElem.classList.add('fade-out');
    setTimeout(() => {
      hideElem.classList.add('hidden');
      hideElem.classList.remove('fade-out');
    }, 800);
  }

  setTimeout(() => {
    if (showElem) {
      showElem.classList.remove('hidden');
      showElem.classList.add('fade-in');
    }

    if (showElem === screenMain) {
      setTimeout(initScrollAnimations, 100);
    }
  }, hideElem ? 800 : 0);
}

window.addEventListener('load', () => {
  checkGuestName();
  createPetals();
  setTimeout(() => {
    showScreen(screenLoader, screenEnvelope);
  }, 1800);
});

function openInvitation() {
  const envelope = document.querySelector('.envelope-card');
  if (envelope) envelope.classList.add('is-open');
  showScreen(screenEnvelope, screenWelcome);
}

if (openEnvelopeBtn) openEnvelopeBtn.addEventListener('click', openInvitation);

if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (bgMusic) {
      bgMusic.play().catch((error) => {
        console.log('Auto-play was prevented by the browser:', error);
      });
    }

    showScreen(screenWelcome, screenCalendar);
    setTimeout(() => showScreen(screenCalendar, screenStory), 4000);
    setTimeout(() => showScreen(screenStory, screenMain), 8000);
  });
}

const targetDate = new Date('December 10, 2026 09:30:00').getTime();
setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dayEl = document.getElementById('days');
    const hourEl = document.getElementById('hours');
    const minuteEl = document.getElementById('minutes');
    const secondEl = document.getElementById('seconds');

    if (dayEl) dayEl.innerText = String(days).padStart(2, '0');
    if (hourEl) hourEl.innerText = String(hours).padStart(2, '0');
    if (minuteEl) minuteEl.innerText = String(minutes).padStart(2, '0');
    if (secondEl) secondEl.innerText = String(seconds).padStart(2, '0');
  }
}, 1000);

const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const submitBtn = document.getElementById('submitBtn');
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPymzA17BUlJHsdWslbRprWiz9DT6tZgAOG22cR3Q3C7mBzNRU7qXh0vFKvVwMh4Tk/exec';

if (rsvpForm) {
  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;
    }

    const formData = new FormData(rsvpForm);

    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      setTimeout(() => {
        rsvpForm.classList.add('hidden');
        if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      }, 1000);
      return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
      .then(() => {
        rsvpForm.classList.add('hidden');
        if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      })
      .catch((error) => {
        console.error('Error!', error.message);
        alert('Something went wrong. Please try again!');
        if (submitBtn) {
          submitBtn.innerText = 'Send RSVP';
          submitBtn.disabled = false;
        }
      });
  });
}
