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

const workspaceStage = document.querySelector(".workspace-section");
const smartLights = workspaceStage ? [...workspaceStage.querySelectorAll(".smart-light")] : [];
const canTrackPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (workspaceStage && smartLights.length && canTrackPointer.matches && !reduceMotion.matches) {
  const depths = [34, -42, 24];
  let pendingFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const renderLights = () => {
    smartLights.forEach((light, index) => {
      const depth = depths[index] ?? 24;
      light.style.transform = `translate3d(${pointerX * depth}px, ${pointerY * depth}px, 0)`;
    });
    pendingFrame = 0;
  };

  workspaceStage.addEventListener("pointermove", (event) => {
    const bounds = workspaceStage.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (!pendingFrame) pendingFrame = requestAnimationFrame(renderLights);
  });

  workspaceStage.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    if (!pendingFrame) pendingFrame = requestAnimationFrame(renderLights);
  });
}
