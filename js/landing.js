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
    var lang = KVSI18n.get();
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  paint();
})();
