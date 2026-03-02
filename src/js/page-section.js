function enhanceStepCards() {
  const cards = document.querySelectorAll(".step-card");
  cards.forEach((card, index) => {
    card.style.animation = `fade-in 240ms ease ${Math.min(index * 36, 320)}ms both`;
    card.addEventListener("focusin", () => card.classList.add("is-focused"));
    card.addEventListener("focusout", () => card.classList.remove("is-focused"));
  });
}

enhanceStepCards();
