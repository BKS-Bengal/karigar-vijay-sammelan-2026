(function (root) {
  "use strict";

  var VIDEO = "https://www.youtube.com/watch?v=BKrUP5Froy4";

  var PROFILES = [
    {
      slug: "anil",
      image: "/assets/official-2026/2026-09-28-03.webp",
      width: 1280,
      height: 723,
      titleKey: "people.anilTitle",
      roleKey: "people.anilRole",
      teaserKey: "people.anilTeaser",
      bodyKey: "people.anilBody",
      altKey: "people.anilAlt",
      capKey: "people.anilCap"
    },
    {
      slug: "paritosh",
      image: "/assets/official-2026/2026-10-07-01.webp",
      width: 1280,
      height: 960,
      titleKey: "people.paritoshTitle",
      roleKey: "people.paritoshRole",
      teaserKey: "people.paritoshTeaser",
      bodyKey: "people.paritoshBody",
      altKey: "people.paritoshAlt",
      capKey: "people.paritoshCap"
    },
    {
      slug: "santosh",
      image: "/assets/official-2026/2026-09-21-01.webp",
      width: 1600,
      height: 1200,
      titleKey: "people.santoshTitle",
      roleKey: "people.santoshRole",
      teaserKey: "people.santoshTeaser",
      bodyKey: "people.santoshBody",
      altKey: "people.santoshAlt",
      capKey: "people.santoshCap"
    }
  ];

  function bySlug(slug) {
    for (var i = 0; i < PROFILES.length; i += 1) {
      if (PROFILES[i].slug === slug) return PROFILES[i];
    }
    return null;
  }

  function text(key) {
    if (!root.KVSI18n) return "";
    return root.KVSI18n.t(key);
  }

  function fallbackBox() {
    var box = document.createElement("div");
    box.className = "craft-fallback";
    box.textContent = text("people.imageFallback");
    return box;
  }

  function paint() {
    document.querySelectorAll("[data-profile]").forEach(function (card) {
      var profile = bySlug(card.getAttribute("data-profile"));
      if (!profile) return;
      var img = card.querySelector("img[data-profile-image]");
      if (!img || img.getAttribute("data-bound") === profile.image) return;
      img.src = profile.image;
      img.width = profile.width;
      img.height = profile.height;
      img.alt = text(profile.altKey);
      img.setAttribute("data-bound", profile.image);
      img.addEventListener("error", function onError() {
        img.removeEventListener("error", onError);
        if (img.parentNode) img.parentNode.replaceChild(fallbackBox(), img);
      });
    });
  }

  root.KVS_PROFILES = {
    video: VIDEO,
    list: PROFILES,
    bySlug: bySlug,
    paint: paint
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
