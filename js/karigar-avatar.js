(function () {
  var mouths = ["closed", "ah", "ee", "oh"];
  var timer = null;
  var mouthAt = 0;
  var speaking = false;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function svg() {
    return '' +
      '<svg class="saathi-svg" viewBox="0 0 160 180" role="img" aria-hidden="true">' +
      '<ellipse cx="80" cy="168" rx="46" ry="8" fill="#e7c9a4"/>' +
      '<g class="saathi-body">' +
      '<path d="M38 108c8 28 18 48 42 48s34-20 42-48c-12 8-28 12-42 12s-30-4-42-12z" fill="#f4e2cf"/>' +
      '<path d="M46 112c6 8 16 14 34 14s28-6 34-14" fill="none" stroke="#c47a4a" stroke-width="3"/>' +
      '<path class="saathi-gamcha" d="M96 104c18 6 28 18 30 34-16 2-28-6-34-16 2-8 4-14 4-18z" fill="#b82932"/>' +
      '<g class="saathi-arm"><path d="M42 116c-14 8-22 22-18 34 8-2 16-12 22-24 4-8 2-12-4-10z" fill="#c9865a"/></g>' +
      '<g class="saathi-head">' +
      '<ellipse cx="80" cy="78" rx="34" ry="36" fill="#c9865a"/>' +
      '<path d="M50 70c2-28 18-40 30-40s28 12 30 40c-8-10-18-14-30-14s-22 4-30 14z" fill="#2b1c1a"/>' +
      '<path d="M58 62c6-8 14-10 22-8" fill="none" stroke="#2b1c1a" stroke-width="3" stroke-linecap="round"/>' +
      '<g class="saathi-eyes">' +
      '<ellipse cx="68" cy="80" rx="5" ry="5.5" fill="#2b1c1a"/>' +
      '<ellipse cx="94" cy="80" rx="5" ry="5.5" fill="#2b1c1a"/>' +
      '<circle cx="70" cy="78" r="1.4" fill="#fff7ea"/>' +
      '<circle cx="96" cy="78" r="1.4" fill="#fff7ea"/>' +
      '<path class="saathi-lid" d="M60 78c6-8 14-8 18 0" />' +
      '<path class="saathi-lid" d="M86 78c6-8 14-8 18 0" />' +
      '</g>' +
      '<path d="M74 92c4 3 8 3 12 0" fill="none" stroke="#8d4b32" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g class="saathi-mouth" data-shape="closed"><path d="M70 102h20" stroke="#6b2e28" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="saathi-mouth" data-shape="ah"><ellipse cx="80" cy="104" rx="7" ry="6" fill="#6b2e28"/></g>' +
      '<g class="saathi-mouth" data-shape="ee"><path d="M68 102c8 6 16 6 24 0" fill="#6b2e28"/></g>' +
      '<g class="saathi-mouth" data-shape="oh"><ellipse cx="80" cy="104" rx="5" ry="7" fill="#6b2e28"/></g>' +
      '</g></g></svg>';
  }

  function mounts() {
    return document.querySelectorAll("[data-saathi]");
  }

  function paint(root, state) {
    root.setAttribute("data-state", state);
    var shape = state === "speaking" ? mouths[mouthAt % mouths.length] : (state === "success" ? "ee" : "closed");
    root.querySelectorAll(".saathi-mouth").forEach(function (node) {
      node.style.display = node.getAttribute("data-shape") === shape ? "" : "none";
    });
  }

  function all(state) {
    mounts().forEach(function (root) { paint(root, state); });
  }

  function stopMouth() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function setState(state) {
    if (state === "speaking" && !reduced) {
      speaking = true;
      stopMouth();
      timer = window.setInterval(function () {
        mouthAt += 1;
        all("speaking");
      }, 160);
      all("speaking");
      return;
    }
    speaking = false;
    stopMouth();
    mouthAt = 0;
    all(state || "idle");
  }

  function mount() {
    mounts().forEach(function (root) {
      if (root.querySelector("svg")) return;
      root.insertAdjacentHTML("afterbegin", svg());
      paint(root, "idle");
    });
    if (!reduced && document.body.getAttribute("data-page") === "landing") {
      setState("greeting");
      window.setTimeout(function () {
        if (!speaking) setState("idle");
      }, 2200);
    }
  }

  window.KVSAvatar = { setState: setState, mount: mount };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
