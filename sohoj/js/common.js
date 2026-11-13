/* Sohoj Tools — shared header/footer, language switch, number formatting.
   Every tool runs 100% in the browser: no uploads, no server, works offline once loaded. */
(function () {
  'use strict';

  var TOOLS = [
    { id: 'thumbnail-maker', icon: '🎬', group: 'creator',
      en: ['Thumbnail Maker', 'YouTube & Facebook thumbnail with Bangla text, 1280×720'],
      bn: ['থাম্বনেইল মেকার', 'বাংলা লেখাসহ ইউটিউব ও ফেসবুক থাম্বনেইল, ১২৮০×৭২০'] },
    { id: 'youtube-thumbnail-downloader', icon: '⬇️', group: 'creator',
      en: ['YouTube Thumbnail Downloader', 'Get the full HD thumbnail of any video'],
      bn: ['ইউটিউব থাম্বনেইল ডাউনলোড', 'যেকোনো ভিডিওর HD থাম্বনেইল নামান'] },
    { id: 'hashtag-generator', icon: '#️⃣', group: 'creator',
      en: ['Caption & Hashtag Helper', 'Bangla + English hashtags by niche, with character limits'],
      bn: ['ক্যাপশন ও হ্যাশট্যাগ', 'বিষয় অনুযায়ী বাংলা ও ইংরেজি হ্যাশট্যাগ, অক্ষর সীমাসহ'] },
    { id: 'youtube-income-calculator', icon: '💰', group: 'creator',
      en: ['YouTube Income Calculator', 'Estimate earnings from views, in taka'],
      bn: ['ইউটিউব আয় ক্যালকুলেটর', 'ভিউ থেকে আয়ের হিসাব, টাকায়'] },
    { id: 'photo-resizer', icon: '🖼️', group: 'image',
      en: ['Photo Resizer (KB)', 'Resize a photo to exact pixels and KB for job & exam forms'],
      bn: ['ছবি রিসাইজ (KB)', 'চাকরি ও ভর্তির ফর্মের জন্য ছবি নির্দিষ্ট সাইজ ও KB-তে'] },
    { id: 'signature-resizer', icon: '✍️', group: 'image',
      en: ['Signature Resizer', 'Make your signature 300×80 under 60 KB'],
      bn: ['স্বাক্ষর রিসাইজ', 'স্বাক্ষর ৩০০×৮০, ৬০ KB-এর নিচে'] },
    { id: 'image-to-pdf', icon: '📄', group: 'image',
      en: ['Image to PDF', 'Turn photos of documents into one PDF'],
      bn: ['ছবি থেকে PDF', 'কাগজপত্রের ছবি দিয়ে একটি PDF বানান'] },
    { id: 'age-calculator', icon: '🎂', group: 'calc',
      en: ['Age Calculator', 'Exact age on any date, for job age limits'],
      bn: ['বয়স ক্যালকুলেটর', 'যেকোনো তারিখে সঠিক বয়স, চাকরির বয়সসীমার জন্য'] },
    { id: 'emi-calculator', icon: '🏦', group: 'calc',
      en: ['Loan EMI Calculator', 'Monthly installment, total interest and full schedule'],
      bn: ['লোন কিস্তি (EMI) ক্যালকুলেটর', 'মাসিক কিস্তি, মোট সুদ ও পুরো তালিকা'] },
    { id: 'land-converter', icon: '📐', group: 'calc',
      en: ['Land Unit Converter', 'Decimal (shotok), katha, bigha, acre, square feet'],
      bn: ['জমির মাপ রূপান্তর', 'শতক, কাঠা, বিঘা, একর, বর্গফুট'] },
    { id: 'bmi-calculator', icon: '⚖️', group: 'calc',
      en: ['BMI Calculator', 'Healthy weight check with Asian cut-offs'],
      bn: ['BMI ক্যালকুলেটর', 'এশিয়ান মানদণ্ডে সঠিক ওজন যাচাই'] }
  ];

  var BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  var root = document.body.getAttribute('data-root') || './';
  var page = document.body.getAttribute('data-tool') || '';

  function getLang() {
    try { var s = localStorage.getItem('sohoj-lang'); if (s === 'en' || s === 'bn') return s; } catch (e) {}
    return 'bn';
  }
  function setLang(l) {
    document.documentElement.lang = l;
    try { localStorage.setItem('sohoj-lang', l); } catch (e) {}
    var btn = document.querySelector('.lang-toggle');
    if (btn) btn.textContent = l === 'bn' ? 'English' : 'বাংলা';
    document.querySelectorAll('[data-ph-en]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-ph-' + l) || '';
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }

  var FT = {
    tools: TOOLS,
    lang: function () { return document.documentElement.lang === 'en' ? 'en' : 'bn'; },
    t: function (en, bn) { return FT.lang() === 'bn' ? bn : en; },
    digits: function (s) {
      s = String(s);
      return FT.lang() === 'bn' ? s.replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }) : s;
    },
    /* Lakh/crore grouping (1,00,000) as used in Bangladesh */
    num: function (n, dec) {
      if (!isFinite(n)) return '—';
      dec = dec == null ? 0 : dec;
      var s = Number(n).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      return FT.digits(s);
    },
    /* Parse input that may contain Bangla digits or commas */
    parse: function (v) {
      v = String(v == null ? '' : v).replace(/[০-৯]/g, function (d) { return BN_DIGITS.indexOf(d); }).replace(/,/g, '').trim();
      return v === '' ? NaN : Number(v);
    },
    kb: function (bytes) { return FT.num(bytes / 1024, 1) + ' KB'; },
    download: function (blob, name) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    },
    el: function (html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  };
  window.FT = FT;

  function bi(en, bn) { return '<span lang="en">' + en + '</span><span lang="bn">' + bn + '</span>'; }

  // Header
  var header = FT.el(
    '<header class="site-header"><div class="wrap">' +
    '<a class="logo" href="' + root + '"><span class="logo-mark" aria-hidden="true">স</span>' + bi('Sohoj Tools', 'সহজ টুলস') + '</a>' +
    '<button class="lang-toggle" type="button" aria-label="Switch language / ভাষা পরিবর্তন"></button>' +
    '</div></header>');
  document.body.insertBefore(header, document.body.firstChild);
  header.querySelector('.lang-toggle').addEventListener('click', function () {
    setLang(FT.lang() === 'bn' ? 'en' : 'bn');
  });

  // Related tools (on tool pages) + footer
  var main = document.querySelector('main .wrap');
  if (page && main) {
    var others = TOOLS.filter(function (t) { return t.id !== page; }).slice(0, 4);
    var rel = '<h2>' + bi('More free tools', 'আরও ফ্রি টুলস') + '</h2><div class="grid">' +
      others.map(function (t) {
        return '<a class="tool-link" href="' + root + t.id + '/"><span class="tool-icon" aria-hidden="true">' + t.icon + '</span><span><strong>' +
          bi(t.en[0], t.bn[0]) + '</strong><small>' + bi(t.en[1], t.bn[1]) + '</small></span></a>';
      }).join('') + '</div>';
    var sec = document.createElement('section');
    sec.innerHTML = rel;
    main.appendChild(sec);
  }

  var footer = FT.el(
    '<footer class="site-footer"><div class="wrap"><nav>' +
    TOOLS.map(function (t) { return '<a href="' + root + t.id + '/">' + bi(t.en[0], t.bn[0]) + '</a>'; }).join('') +
    '</nav><p>' + bi('100% free. Your files never leave your phone: everything runs in your browser.',
      '১০০% ফ্রি। আপনার ফাইল কোথাও আপলোড হয় না, সব কাজ আপনার ব্রাউজারেই হয়।') + '</p></div></footer>');
  document.body.appendChild(footer);

  setLang(getLang());

  // Offline support (installable app)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register(root + 'sw.js').catch(function () {});
  }
})();
