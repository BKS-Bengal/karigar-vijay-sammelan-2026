(function () {
  "use strict";

  var currentRole = "";
  var currentId = "";
  var pendingNote = "";

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

  function yesNo(value) {
    if (value === true) return t("review.given");
    if (value === false) return t("review.notGiven");
    return t("review.unknown");
  }

  function consentText(row) {
    if (row.data_use_consent_at || row.data_use_consent === true) return t("review.given");
    if (row.data_use_consent === false) return t("review.notGiven");
    return t("review.unknown");
  }

  function workText(list) {
    if (!Array.isArray(list) || !list.length) return t("review.unknown");
    return list.map(function (id) { return t("cat." + id); }).join(", ");
  }

  function rowHtml(label, value) {
    return "<p><strong>" + esc(label) + "</strong><br>" + esc(value) + "</p>";
  }

  function selectHtml(id, label, current, keys, prefix) {
    var html = '<label for="' + id + '">' + esc(label) + '</label><select id="' + id + '">';
    keys.forEach(function (key) {
      html += '<option value="' + esc(key) + '"' + (key === current ? " selected" : "") + ">"
        + esc(t(prefix + key)) + "</option>";
    });
    return html + "</select>";
  }

  function auditLine(item) {
    var fields = Array.isArray(item.fields) ? item.fields.slice() : [];
    if (item.changed_fields && typeof item.changed_fields === "object") {
      fields = Object.keys(item.changed_fields).filter(function (key) {
        return key !== "mobile" && key !== "mobile_normalized"
          && key !== "sardar_mobile" && key !== "sardar_mobile_normalized"
          && key !== "address_pin" && key !== "updated_at";
      });
    }
    var parts = [item.created_at || "", item.actor_role || "", item.action || ""];
    if (fields.length) parts.push(fields.join(", "));
    return "<li>" + esc(parts.filter(Boolean).join(" · ")) + "</li>";
  }

  function render(row, audit) {
    var html = '<p><a href="/admin/karigar-registrations/">' + esc(t("admin.back")) + "</a></p>";
    html += "<h1>" + esc(row.registration_no || t("admin.title")) + "</h1>";
    if (row.possible_duplicate) html += '<p class="badge">' + esc(t("admin.duplicate")) + "</p>";
    html += rowHtml(t("field.name"), row.full_name || "");
    if (row.mobile) html += rowHtml(t("field.mobile"), row.mobile);
    html += rowHtml(t("field.locality"), row.address_locality || t("review.unknown"));
    if (row.address_post_office) html += rowHtml(t("field.post"), row.address_post_office);
    if (row.address_police_station) html += rowHtml(t("field.ps"), row.address_police_station);
    html += rowHtml(t("field.district"), row.address_district || t("review.unknown"));
    if (row.address_pin) html += rowHtml(t("field.pin"), row.address_pin);
    html += rowHtml(t("field.work"), workText(row.work_categories));
    if (row.work_description) html += rowHtml(t("field.workDetail"), row.work_description);
    html += rowHtml(t("field.team"), row.team_unknown ? t("review.unknown") : (row.team_name || t("review.unknown")));
    html += rowHtml(t("field.sardar"), row.sardar_unknown ? t("review.unknown") : (row.sardar_name || t("review.unknown")));
    if (row.sardar_mobile) html += rowHtml(t("field.sardarMobile"), row.sardar_mobile);
    html += rowHtml(t("field.attendance"), row.attendance_status ? t("attendance." + row.attendance_status) : t("review.unknown"));
    html += rowHtml(t("admin.status"), row.status ? t("status." + row.status) : t("review.unknown"));
    html += rowHtml(t("field.photo"), row.photo_available ? t("review.given") : (row.photo_follow_up ? t("review.laterPhoto") : t("review.notGiven")));
    html += rowHtml(t("field.publicity"), row.photo_publicity_consent === true ? t("review.yesPublish") : t("review.noPublish"));
    html += rowHtml(t("field.consent"), consentText(row) + (row.consent_version ? " · " + row.consent_version : ""));
    if (row.assisted || row.assisted_by) {
      html += rowHtml(t("assisted.label"), row.assisted_by || yesNo(row.assisted));
    }
    if (row.verification_note) html += rowHtml(t("admin.note"), row.verification_note);
    if (row.locale) html += rowHtml(t("admin.locale"), row.locale);
    if (row.created_at) html += rowHtml(t("admin.created"), row.created_at);
    if (row.updated_at) html += rowHtml(t("admin.updated"), row.updated_at);
    if (row.photo_available) {
      html += '<figure><img src="/api/admin/karigar-registrations/photo?id='
        + encodeURIComponent(currentId) + '" alt="' + esc(t("admin.photo")) + '"><figcaption>'
        + esc(t("admin.photo")) + "</figcaption></figure>";
    }
    if (currentRole === "event_admin") {
      html += '<form id="edit" class="panel">';
      html += selectHtml("edit-status", t("admin.status"), row.status || "", Object.keys(KVSSchema.STATUSES), "status.");
      html += selectHtml("edit-attendance", t("field.attendance"), row.attendance_status || "", Object.keys(KVSSchema.ATTENDANCE_ADMIN), "attendance.");
      html += '<label for="edit-note">' + esc(t("admin.note")) + "</label>";
      html += '<textarea id="edit-note" maxlength="500">' + esc(row.verification_note || "") + "</textarea>";
      html += "<p>" + esc(t("admin.noteWarn")) + "</p>";
      html += '<p><button class="btn btn-primary" type="submit">' + esc(t("admin.save")) + "</button></p>";
      html += "</form>";
    }
    html += "<h2>" + esc(t("admin.audit")) + "</h2>";
    if (!audit || !audit.length) html += "<p>" + esc(t("admin.empty")) + "</p>";
    else {
      html += "<ul>";
      audit.forEach(function (item) { html += auditLine(item); });
      html += "</ul>";
    }
    document.getElementById("detail").innerHTML = html;
    var form = document.getElementById("edit");
    if (form) form.addEventListener("submit", save);
  }

  function setStatus(text) {
    document.getElementById("detail-status").textContent = text || "";
  }

  function load() {
    setStatus(pendingNote || t("admin.loading"));
    fetch("/api/admin/karigar-registrations/record?id=" + encodeURIComponent(currentId), { credentials: "same-origin" })
      .then(function (res) {
        return res.json().then(function (data) { return { status: res.status, data: data }; });
      })
      .then(function (result) {
        if (result.status === 401) {
          setStatus(t("admin.unauth"));
          document.getElementById("detail").innerHTML = '<p><a href="/admin/karigar-registrations/">' + esc(t("admin.back")) + "</a></p>";
          return;
        }
        if (result.status === 404) {
          setStatus(t("admin.missing"));
          return;
        }
        if (!result.data || result.data.ok !== true || !result.data.row) {
          setStatus(result.status === 503 ? t("error.config") : t("admin.error"));
          return;
        }
        currentRole = result.data.role || "";
        setStatus(pendingNote);
        pendingNote = "";
        render(result.data.row, result.data.audit || []);
      })
      .catch(function () {
        setStatus(t("admin.error"));
      });
  }

  function save(event) {
    event.preventDefault();
    setStatus(t("admin.loading"));
    var body = {
      status: document.getElementById("edit-status").value,
      attendance_status: document.getElementById("edit-attendance").value,
      verification_note: document.getElementById("edit-note").value
    };
    fetch("/api/admin/karigar-registrations/record?id=" + encodeURIComponent(currentId), {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    }).then(function (result) {
      if (result.status === 200 && result.data && result.data.ok === true) {
        pendingNote = t("admin.saved");
        load();
        return;
      }
      setStatus(result.status === 503 ? t("error.config") : t("admin.error"));
    }).catch(function () {
      setStatus(t("admin.error"));
    });
  }

  KVSI18n.set(KVSI18n.get());
  KVSI18n.apply(document);
  currentId = new URLSearchParams(window.location.search).get("id") || "";
  if (!KVSSchema.isUuid(currentId)) {
    setStatus(t("admin.missing"));
    document.getElementById("detail").innerHTML = '<p><a href="/admin/karigar-registrations/">' + esc(t("admin.back")) + "</a></p>";
    return;
  }
  load();
})();
