document.addEventListener("DOMContentLoaded", () => {
  const backgroundCanvas = document.getElementById("bg-canvas");

  if (backgroundCanvas) {
    const context = backgroundCanvas.getContext("2d");
    const particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame = 0;

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      backgroundCanvas.width = canvasWidth * pixelRatio;
      backgroundCanvas.height = canvasHeight * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createParticle = (initial = false) => ({
      x: Math.random() * canvasWidth,
      y: initial ? Math.random() * canvasHeight : canvasHeight + 30,
      radius: 1.5 + Math.random() * 4.5,
      speed: 0.08 + Math.random() * 0.24,
      drift: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.08 + Math.random() * 0.2
    });

    const seedParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(70, Math.max(28, Math.floor(canvasWidth / 18)));
      for (let index = 0; index < particleCount; index += 1) {
        particles.push(createParticle(true));
      }
    };

    const draw = (time) => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(time * 0.0004 + particle.phase) * 0.08;

        if (particle.y < -30) {
          Object.assign(particle, createParticle());
        }

        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5
        );
        glow.addColorStop(0, `rgba(212, 175, 55, ${particle.opacity})`);
        glow.addColorStop(0.35, `rgba(243, 221, 158, ${particle.opacity * 0.45})`);
        glow.addColorStop(1, "rgba(243, 221, 158, 0)");

        context.beginPath();
        context.fillStyle = glow;
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    seedParticles();
    window.addEventListener("resize", () => {
      resizeCanvas();
      seedParticles();
    });
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(animationFrame);
    }, { once: true });

    const homeHero = document.getElementById("home");

    if (homeHero && "IntersectionObserver" in window) {
      const backgroundObserver = new IntersectionObserver(([entry]) => {
        backgroundCanvas.classList.toggle("is-active", !entry.isIntersecting);
      }, {
        threshold: 0.15
      });

      backgroundObserver.observe(homeHero);
    } else {
      backgroundCanvas.classList.add("is-active");
    }
  }

  const envelopeIntro = document.getElementById("envelope-intro");
  const openEnvelopeButton = document.getElementById("open-envelope");
  const openEnvelopeText = document.getElementById("open-envelope-text");
  const openEnvelopeHero = document.getElementById("open-envelope-hero");

  if (envelopeIntro && (openEnvelopeButton || openEnvelopeText || openEnvelopeHero)) {
    const sparkleBurst = envelopeIntro.querySelector("#sparkle-burst");
    const sparkleDirections = [
      [-110, -95], [-70, -145], [-20, -120], [38, -150], [92, -105],
      [135, -45], [150, 20], [105, 88], [55, 125], [-12, 145],
      [-78, 112], [-135, 60], [-155, -18], [-42, -42], [48, 45]
    ];

    const createSparkles = () => {
      if (!sparkleBurst || sparkleBurst.childElementCount) return;
      sparkleDirections.forEach(([x, y], index) => {
        const sparkle = document.createElement("span");
        sparkle.style.setProperty("--sparkle-x", `${x}px`);
        sparkle.style.setProperty("--sparkle-y", `${y}px`);
        sparkle.style.animationDelay = `${index * 22}ms`;
        sparkleBurst.appendChild(sparkle);
      });
    };

    const openInvitation = () => {
      if (envelopeIntro.classList.contains("is-opening")) return;

      createSparkles();
      envelopeIntro.classList.add("is-opening");
      const card = envelopeIntro.querySelector(".envelope__card");
      let revealComplete = false;

      const revealWebsite = () => {
        if (revealComplete) return;
        revealComplete = true;
        document.body.classList.remove("intro-locked");
        document.body.classList.add("is-unlocked");
        envelopeIntro.classList.add("is-complete");
        window.dispatchEvent(new Event("invitation:unlocked"));
        window.setTimeout(() => envelopeIntro.remove(), 950);
      };

      window.setTimeout(() => {
        envelopeIntro.classList.add("is-card-expanded");
      }, 1450);
      window.setTimeout(revealWebsite, 2400);
    };

    [openEnvelopeButton, openEnvelopeText, openEnvelopeHero].forEach((button) => {
      if (button) button.addEventListener("click", openInvitation, { once: true });
    });
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
