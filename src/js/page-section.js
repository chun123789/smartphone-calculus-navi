function addSectionHints() {
  const cards = document.querySelectorAll(".learn-card");
  cards.forEach((card) => {
    card.addEventListener("focusin", () => {
      card.style.boxShadow = "0 0 0 2px rgba(14,165,233,0.3)";
    });
    card.addEventListener("focusout", () => {
      card.style.boxShadow = "none";
    });
  });
}

addSectionHints();

