document.addEventListener("DOMContentLoaded", () => {
  const envelopeIntro = document.getElementById("envelope-intro");
  const openEnvelopeButton = document.getElementById("open-envelope");

  if (envelopeIntro && openEnvelopeButton) {
    openEnvelopeButton.addEventListener("click", () => {
      if (envelopeIntro.classList.contains("is-opening")) return;

      envelopeIntro.classList.add("is-opening");
      window.setTimeout(() => {
        document.body.classList.remove("intro-locked");
        document.body.classList.add("is-unlocked");
        envelopeIntro.classList.add("is-complete");
        window.dispatchEvent(new Event("invitation:unlocked"));
        window.setTimeout(() => envelopeIntro.remove(), 950);
      }, 2700);
    }, { once: true });
  }

  const weddingDate = new Date("2026-12-10T09:00:00+05:30").getTime();

  function updateCountdown() {
    const countdownEls = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    if (!countdownEls.days) return;

    const now = Date.now();
    const distance = Math.max(0, weddingDate - now);

    const values = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60)
    };

    Object.entries(values).forEach(([key, value]) => {
      countdownEls[key].textContent = String(value).padStart(2, "0");
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const guestInput = document.querySelector('input[name="guests"]');
  const guestButtons = document.querySelectorAll(".guest-button");

  guestButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!guestInput) return;

      const currentValue = Number(guestInput.value) || 1;
      const action = button.dataset.action;
      const min = Number(guestInput.min) || 1;
      const max = Number(guestInput.max) || 10;

      if (action === "increase") {
        guestInput.value = String(Math.min(currentValue + 1, max));
      }

      if (action === "decrease") {
        guestInput.value = String(Math.max(currentValue - 1, min));
      }
    });
  });

  const rsvpForm = document.getElementById("wedding-rsvp-form");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(rsvpForm);
      const fullName = (formData.get("name") || "").toString().trim();
      const attendance = document.querySelector('input[name="attendance"]:checked');
      const guestCount = Number(formData.get("guests") || 1);
      const responseText = attendance ? attendance.value : "Not selected";

      const message = [
        "Hello Nuwan & Tharushi!",
        "I would like to RSVP for your wedding.",
        `Full Name: ${fullName || "Not provided"}`,
        `Attendance: ${responseText === "accept" ? "Joyfully Accept" : responseText === "decline" ? "Regretfully Decline" : responseText}`,
        `Number of Guests: ${guestCount}`
      ].join("\n");

      const whatsappUrl = `https://wa.me/94760481677?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener");
    });
  }

  const navLinks = document.querySelectorAll('.nav-item, a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#") || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealTargets = document.querySelectorAll(
    ".page-shell section, .page-shell section > *, .page-shell section article, " +
    ".page-shell section img, .page-shell section form > *"
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-target");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  document.querySelectorAll(".timeline-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 140}ms`;
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  }

  window.addEventListener("invitation:unlocked", () => {
    revealTargets.forEach((target) => {
      if (target.getBoundingClientRect().top <= window.innerHeight * 1.1) {
        target.classList.add("is-revealed");
      }
    });
  });
});
