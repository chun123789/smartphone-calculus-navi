function enhanceCards() {
  const cards = document.querySelectorAll(".learn-card");
  cards.forEach((card, index) => {
    card.style.transition = "transform 180ms ease";
    card.addEventListener("pointerenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        card.style.transform = "translateY(-2px)";
      }
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "translateY(0)";
    });
    card.style.animation = `fade-in 200ms ease ${Math.min(index * 60, 300)}ms both`;
  });
}

enhanceCards();

