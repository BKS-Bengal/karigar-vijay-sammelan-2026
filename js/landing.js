(function () {
  document.querySelectorAll("[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      KVSI18n.set(button.getAttribute("data-lang"));
      paint();
    });
  });

  function paint() {
    KVSI18n.set(KVSI18n.get());
    KVSI18n.apply(document);
    if (window.KVS_PROFILES) window.KVS_PROFILES.paint();
    var lang = KVSI18n.get();
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  var toggle = document.querySelector("[data-poster-toggle]");
  var motion = document.getElementById("hero-motion");
  if (toggle && motion) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    toggle.addEventListener("click", function () {
      if (reduced) return;
      var paused = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      motion.src = paused ? motion.getAttribute("data-still") : motion.getAttribute("data-gif");
      var label = toggle.querySelector("span");
      if (label) label.setAttribute("data-i18n", paused ? "hero.play" : "hero.pause");
      KVSI18n.apply(toggle);
    });
  }

  paint();
})();
