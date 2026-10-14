(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var nativeCrossDocument = false;
  try {
    nativeCrossDocument = !!(window.CSS && CSS.supports && CSS.supports("@view-transition", "navigation: auto"));
  } catch (error) {}
  if (nativeCrossDocument) return;

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (error) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    try { sessionStorage.setItem("kvs-enter", "1"); } catch (error) {}
    document.documentElement.classList.add("is-leaving");
    window.setTimeout(function () { location.href = url.href; }, 180);
  });

  try {
    if (sessionStorage.getItem("kvs-enter") === "1") {
      sessionStorage.removeItem("kvs-enter");
      document.documentElement.classList.add("is-entering");
    }
  } catch (error) {}
})();
