function enhanceCards() {
  const cards = document.querySelectorAll(".learn-card");
  cards.forEach((card, index) => {
    card.style.transition = "transform 180ms ease, border-color 180ms ease";
    card.addEventListener("pointerenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        card.style.transform = "translateY(-2px)";
        card.style.borderColor = "var(--brand)";
      }
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "translateY(0)";
      card.style.borderColor = "var(--line)";
    });
    card.style.animation = `fade-in 220ms ease ${Math.min(index * 45, 320)}ms both`;
  });
}

enhanceCards();
