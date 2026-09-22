const root = document.documentElement;
const languageButton = document.querySelector(".language-toggle");

const setLanguage = (language) => {
  const nextLanguage = language === "en" ? "en" : "zh";
  root.dataset.language = nextLanguage;
  root.lang = nextLanguage === "en" ? "en" : "zh-CN";
  localStorage.setItem("wa-score-language", nextLanguage);
};

const savedLanguage = localStorage.getItem("wa-score-language");
setLanguage(savedLanguage || (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"));

languageButton?.addEventListener("click", () => {
  setLanguage(root.dataset.language === "zh" ? "en" : "zh");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
