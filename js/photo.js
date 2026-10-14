(function () {
  var stream = null;

  function stop() {
    if (!stream) return;
    stream.getTracks().forEach(function (track) { track.stop(); });
    stream = null;
  }

  function open(video) {
    stop();
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }
    }).then(function (next) {
      stream = next;
      video.srcObject = next;
      return video.play();
    });
  }

  function capture(video) {
    var canvas = document.createElement("canvas");
    var width = video.videoWidth || 720;
    var height = video.videoHeight || 960;
    var scale = Math.min(1, 1280 / width);
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, "image/jpeg", 0.82);
    });
  }

  function fileToJpeg(file) {
    return createImageBitmap(file).then(function (bitmap) {
      var canvas = document.createElement("canvas");
      var scale = Math.min(1, 1280 / bitmap.width);
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) { resolve(blob); }, "image/jpeg", 0.82);
      });
    });
  }

  function upload(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var base64 = String(reader.result).split(",")[1];
        fetch("/api/karigar-registrations/photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: base64 })
        }).then(function (res) {
          return res.json().then(function (data) {
            resolve({ ok: res.ok && data.ok, status: res.status, data: data, preview: reader.result });
          });
        }).catch(reject);
      };
      reader.readAsDataURL(blob);
    });
  }

  window.KVSPhoto = { open: open, capture: capture, fileToJpeg: fileToJpeg, upload: upload, stop: stop };
})();
