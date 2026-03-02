function enhanceCards() {
  const cards = document.querySelectorAll(".learn-card, .path-card, .unit-pill, .step-card");
  cards.forEach((card, index) => {
    card.style.animation = `fade-in 280ms ease ${Math.min(index * 40, 280)}ms both`;
  });
}

function initRevealSections() {
  const sections = document.querySelectorAll(".content-section, .hero-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  sections.forEach((section) => observer.observe(section));
}

function pulsePrimaryAction() {
  const button = document.querySelector(".path-card .path-link");
  if (!button) {
    return;
  }
  button.classList.add("pulse-action");
}

enhanceCards();
initRevealSections();
pulsePrimaryAction();
