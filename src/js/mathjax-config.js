if (!window.MathJax) {
  window.MathJax = {
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    },
    options: {
      enableMenu: false,
      enableAssistiveMml: true
    },
    chtml: {
      matchFontHeight: false
    }
  };
}

if (!document.querySelector("script[data-mathjax-loader]")) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  script.defer = true;
  script.setAttribute("data-mathjax-loader", "true");
  document.head.append(script);
}

