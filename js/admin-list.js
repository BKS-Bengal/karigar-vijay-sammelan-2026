(function () {
  "use strict";

  var page = 1;
  var role = "";
  var total = 0;
  var PAGE_SIZE = 20;

  function t(key) {
    return KVSI18n.t(key);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function show(id, on) {
    var node = document.getElementById(id);
    if (node) node.hidden = !on;
  }

  function option(value, label) {
    return '<option value="' + esc(value) + '">' + esc(label) + "</option>";
  }

  function fillSelects() {
    var status = document.getElementById("status");
    var attendance = document.getElementById("attendance");
    var category = document.getElementById("category");
    var keep = {
      status: status.value,
      attendance: attendance.value,
      category: category.value
    };
    var statusHtml = option("", t("admin.all"));
    Object.keys(KVSSchema.STATUSES).forEach(function (key) {
      statusHtml += option(key, t("status." + key));
    });
    status.innerHTML = statusHtml;
    var attendanceHtml = option("", t("admin.all"));
    Object.keys(KVSSchema.ATTENDANCE_ADMIN).forEach(function (key) {
      attendanceHtml += option(key, t("attendance." + key));
    });
    attendance.innerHTML = attendanceHtml;
    var categoryHtml = option("", t("admin.all"));
    Object.keys(KVSSchema.WORK_CATEGORIES).forEach(function (key) {
      categoryHtml += option(key, t("cat." + key));
    });
    category.innerHTML = categoryHtml;
    status.value = keep.status;
    attendance.value = keep.attendance;
    category.value = keep.category;
  }

  function paintLang() {
    KVSI18n.apply(document);
    var lang = KVSI18n.get();
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-lang") === lang ? "true" : "false");
    });
    fillSelects();
  }

  function queryString() {
    var params = new URLSearchParams();
    params.set("page", String(page));
    var q = document.getElementById("q").value.trim();
    var status = document.getElementById("status").value;
    var attendance = document.getElementById("attendance").value;
    var category = document.getElementById("category").value;
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (attendance) params.set("attendance", attendance);
    if (category) params.set("category", category);
    return params.toString();
  }

  function exportLinks() {
    var kinds = ["verified", "team", "roster", "checkin", "gallery"];
    if (role === "event_admin") kinds.push("contacts");
    var html = "<p>" + esc(t("admin.exports")) + "</p>";
    kinds.forEach(function (kind) {
      html += '<a class="btn btn-line" href="/api/admin/karigar-registrations/export?kind='
        + encodeURIComponent(kind) + '">' + esc(t("export." + kind)) + "</a>";
    });
    document.getElementById("exports").innerHTML = html;
  }

  function workText(list) {
    if (!Array.isArray(list) || !list.length) return "";
    return list.map(function (id) { return t("cat." + id); }).join(", ");
  }

  function renderRows(rows) {
    var list = document.getElementById("list");
    if (!rows.length) {
      list.innerHTML = "<p>" + esc(t("admin.empty")) + "</p>";
      return;
    }
    var html = '<table class="admin-table"><thead><tr><th>'
      + esc(t("success.keep")) + "</th><th>"
      + esc(t("field.name")) + "</th><th>"
      + esc(t("field.work")) + "</th><th>"
      + esc(t("admin.status")) + "</th><th>"
      + esc(t("field.attendance")) + "</th></tr></thead><tbody>";
    rows.forEach(function (row) {
      var href = "/admin/karigar-registrations/record/?id=" + encodeURIComponent(row.id || "");
      html += '<tr><td><a href="' + href + '">' + esc(row.registration_no || "") + "</a></td>";
      html += "<td>" + esc(row.full_name || "");
      if (row.possible_duplicate) html += ' <span class="badge">' + esc(t("admin.duplicate")) + "</span>";
      html += "</td><td>" + esc(workText(row.work_categories)) + "</td>";
      html += "<td>" + esc(row.status ? t("status." + row.status) : "") + "</td>";
      html += "<td>" + esc(row.attendance_status ? t("attendance." + row.attendance_status) : "") + "</td></tr>";
    });
    html += "</tbody></table>";
    list.innerHTML = html;
  }

  function loadList() {
    var statusNode = document.getElementById("list-status");
    statusNode.textContent = t("admin.loading");
    fetch("/api/admin/karigar-registrations?" + queryString(), { credentials: "same-origin" })
      .then(function (res) {
        return res.json().then(function (data) { return { status: res.status, data: data }; });
      })
      .then(function (result) {
        if (result.status === 401) {
          role = "";
          show("desk", false);
          show("login", true);
          statusNode.textContent = "";
          return;
        }
        if (!result.data || result.data.ok !== true) {
          statusNode.textContent = result.status === 503 ? t("error.config") : t("admin.error");
          document.getElementById("list").innerHTML = "";
          return;
        }
        role = result.data.role || role;
        total = result.data.total || 0;
        page = result.data.page || page;
        exportLinks();
        renderRows(result.data.rows || []);
        if (!total) statusNode.textContent = "";
        else {
          var from = ((page - 1) * PAGE_SIZE) + 1;
          var to = Math.min(page * PAGE_SIZE, total);
          statusNode.textContent = from + "–" + to + " / " + total;
        }
        document.getElementById("prev").disabled = page <= 1;
        document.getElementById("next").disabled = page * PAGE_SIZE >= total;
      })
      .catch(function () {
        statusNode.textContent = t("admin.error");
      });
  }

  function enterDesk() {
    show("login", false);
    show("desk", true);
    loadList();
  }

  document.querySelectorAll("[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      KVSI18n.set(button.getAttribute("data-lang"));
      paintLang();
      if (!document.getElementById("desk").hidden) {
        exportLinks();
        loadList();
      }
    });
  });

  document.getElementById("login").addEventListener("submit", function (event) {
    event.preventDefault();
    var error = document.getElementById("login-error");
    error.textContent = "";
    fetch("/api/admin/karigar-session", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: document.getElementById("token").value })
    }).then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    }).then(function (result) {
      if (result.status === 200 && result.data && result.data.ok === true && result.data.role) {
        role = result.data.role;
        document.getElementById("token").value = "";
        page = 1;
        enterDesk();
        return;
      }
      error.textContent = result.status === 503 ? t("error.config") : t("admin.badToken");
    }).catch(function () {
      error.textContent = t("admin.error");
    });
  });

  document.getElementById("logout").addEventListener("click", function () {
    fetch("/api/admin/karigar-session", { method: "DELETE", credentials: "same-origin" })
      .finally(function () {
        role = "";
        show("desk", false);
        show("login", true);
      });
  });

  document.getElementById("filters").addEventListener("submit", function (event) {
    event.preventDefault();
    page = 1;
    loadList();
  });

  document.getElementById("prev").addEventListener("click", function () {
    if (page > 1) {
      page -= 1;
      loadList();
    }
  });

  document.getElementById("next").addEventListener("click", function () {
    if (page * PAGE_SIZE < total) {
      page += 1;
      loadList();
    }
  });

  paintLang();
  fetch("/api/admin/karigar-session", { credentials: "same-origin" })
    .then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    })
    .then(function (result) {
      if (result.status === 200 && result.data && result.data.ok === true && result.data.role) {
        role = result.data.role;
        enterDesk();
        return;
      }
      show("login", true);
    })
    .catch(function () {
      show("login", true);
      document.getElementById("login-error").textContent = t("admin.error");
    });
})();
