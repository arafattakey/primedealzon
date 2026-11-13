/* Shared engine for the photo and signature resizers.
   Draws the image at exact pixel size, then finds the highest JPEG quality that stays under the KB limit. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PRESETS = window.RESIZER_PRESETS || [];
  var isSig = document.body.getAttribute('data-tool') === 'signature-resizer';
  var img = null, fileName = 'photo';

  function fillPresets() {
    var v = $('preset').value || '0';
    $('preset').innerHTML = PRESETS.map(function (p, i) {
      return '<option value="' + i + '">' + FT.t(p.en, p.bn) + '</option>';
    }).join('') + '<option value="custom">' + FT.t('Custom size', 'নিজের মতো সাইজ') + '</option>';
    $('preset').value = v;
  }
  function applyPreset() {
    var p = PRESETS[$('preset').value];
    $('custom').hidden = !!p;
    if (p) { $('w').value = p.w; $('h').value = p.h; $('kb').value = p.kb; }
  }
  $('preset').addEventListener('change', function () { applyPreset(); run(); });
  ['w', 'h', 'kb'].forEach(function (id) { $(id).addEventListener('change', run); });
  document.querySelectorAll('input[name="fit"]').forEach(function (r) { r.addEventListener('change', run); });
  if ($('clean')) $('clean').addEventListener('change', run);
  document.addEventListener('langchange', function () { fillPresets(); });

  function load(f) {
    $('err').hidden = true;
    if (!f) return;
    if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name)) {
      return fail(FT.t('Please choose a photo (JPG or PNG).', 'অনুগ্রহ করে একটি ছবি (JPG বা PNG) বাছুন।'));
    }
    fileName = f.name.replace(/\.[^.]+$/, '') || 'photo';
    var i = new Image();
    i.onload = function () { img = i; $('orig').textContent = FT.t('Original: ', 'মূল ছবি: ') + FT.digits(i.naturalWidth + '×' + i.naturalHeight) + ' px, ' + FT.kb(f.size); run(); };
    i.onerror = function () { fail(FT.t('This photo format is not supported (iPhone HEIC photos must be converted to JPG first).', 'এই ছবির ফরম্যাট চলে না (আইফোনের HEIC ছবি আগে JPG করে নিন)।')); };
    i.src = URL.createObjectURL(f);
  }
  function fail(msg) { $('err').textContent = msg; $('err').hidden = false; $('res').hidden = true; }

  var drop = $('drop');
  $('file').addEventListener('change', function (e) { load(e.target.files[0]); });
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); load(e.dataTransfer.files[0]); });

  function toBlob(c, q) { return new Promise(function (r) { c.toBlob(r, 'image/jpeg', q); }); }

  function whiten(ctx, w, h) {
    // Turn a phone photo of a signature on paper into dark ink on pure white
    var d = ctx.getImageData(0, 0, w, h), p = d.data, sum = 0, n = w * h, i;
    for (i = 0; i < p.length; i += 4) sum += (p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114);
    var thr = (sum / n) * 0.78;
    for (i = 0; i < p.length; i += 4) {
      var l = p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114;
      if (l > thr) { p[i] = p[i + 1] = p[i + 2] = 255; }
      else { var k = Math.max(0, l * 0.5); p[i] = p[i + 1] = p[i + 2] = k; }
    }
    ctx.putImageData(d, 0, 0);
  }

  async function run() {
    if (!img) return;
    var W = Math.round(FT.parse($('w').value)), H = Math.round(FT.parse($('h').value)), KB = FT.parse($('kb').value);
    if (!(W > 10 && H > 10 && W <= 6000 && H <= 6000 && KB > 1)) return fail(FT.t('Enter a valid width, height and KB.', 'সঠিক প্রস্থ, উচ্চতা ও KB দিন।'));
    $('err').hidden = true;

    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingQuality = 'high';
    var fit = (document.querySelector('input[name="fit"]:checked') || {}).value || 'crop';
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = fit === 'crop' ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih);
    ctx.drawImage(img, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
    if ($('clean') && $('clean').checked) whiten(ctx, W, H);

    // Forms disagree on 1 KB = 1000 or 1024 bytes; aim under 1000 to pass both.
    var limit = KB * 1000 - 200;
    var lo = 0.05, hi = 0.95, best = null, b;
    b = await toBlob(c, hi);
    if (b.size <= limit) best = { b: b, q: hi };
    else {
      for (var i = 0; i < 8; i++) {
        var mid = (lo + hi) / 2; b = await toBlob(c, mid);
        if (b.size <= limit) { best = { b: b, q: mid }; lo = mid; } else { hi = mid; }
      }
      if (!best) { b = await toBlob(c, 0.05); if (b.size <= limit) best = { b: b, q: 0.05 }; }
    }
    if (!best) return fail(FT.t('Could not get under ' + KB + ' KB at this size. Make the pixels smaller or raise the KB limit.',
      FT.digits(KB) + ' KB-এর নিচে নামানো গেল না। পিক্সেল ছোট করুন বা KB বাড়ান।'));

    var url = URL.createObjectURL(best.b);
    $('preview').src = url;
    $('size').textContent = FT.kb(best.b.size);
    $('dims').textContent = FT.digits(W + '×' + H) + ' px';
    $('qual').textContent = FT.digits(Math.round(best.q * 100)) + '%';
    $('res').hidden = false;
    $('dl').onclick = function () { FT.download(best.b, fileName + '-' + W + 'x' + H + '.jpg'); };
  }

  fillPresets(); applyPreset();
})();
