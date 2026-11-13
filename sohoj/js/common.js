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
      bn: ['BMI ক্যালকুলেটর', 'এশিয়ান মানদণ্ডে সঠিক ওজন যাচাই'] },
    { id: 'mfs-scam-help', icon: '🚨', group: 'citizen',
      en: ['bKash/Nagad Scam Help & GD', 'Who to call now, and a ready police GD in Bangla'],
      bn: ['বিকাশ/নগদ প্রতারণা ও জিডি', 'এখনই কোথায় ফোন করবেন, আর তৈরি থানার জিডি'] },
    { id: 'link-checker', icon: '🔍', group: 'citizen',
      en: ['Fake Link Checker', 'Is this bKash, NID or passport link real or a scam?'],
      bn: ['ভুয়া লিংক যাচাই', 'বিকাশ, এনআইডি বা পাসপোর্টের লিংক আসল নাকি প্রতারণা?'] },
    { id: 'govt-portals', icon: '🏛️', group: 'citizen',
      en: ['Official Govt Websites', 'The real .gov.bd sites for NID, passport, BRTA, tax and more'],
      bn: ['সরকারি ওয়েবসাইটের তালিকা', 'এনআইডি, পাসপোর্ট, বিআরটিএ, ট্যাক্সের আসল .gov.bd সাইট'] },
    { id: 'overseas-job-check', icon: '✈️', group: 'citizen',
      en: ['Overseas Job Safety Check', '5 checks before you pay an agency or hand over your passport'],
      bn: ['বিদেশে চাকরি: নিরাপত্তা যাচাই', 'এজেন্সিকে টাকা বা পাসপোর্ট দেওয়ার আগে ৫টি যাচাই'] },
    { id: 'cod-profit-calculator', icon: '📦', group: 'seller',
      en: ['COD Profit Calculator', 'See how returns and ad cost eat your profit'],
      bn: ['COD লাভ ক্যালকুলেটর', 'রিটার্ন আর বিজ্ঞাপন খরচে লাভ কতটা কমে দেখুন'] },
    { id: 'product-post-maker', icon: '🛍️', group: 'seller',
      en: ['Product Post Maker', 'Ready Facebook sales post in Bangla, Banglish or English'],
      bn: ['প্রোডাক্ট পোস্ট মেকার', 'বাংলা, বাংলিশ বা ইংরেজিতে তৈরি ফেসবুক সেল পোস্ট'] }
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
    /* Reference data lives in data/*.json so it can be updated without touching code */
    data: function (name) {
      return fetch(root + 'data/' + name + '.json').then(function (r) {
        if (!r.ok) throw new Error('data ' + name);
        return r.json();
      });
    },
    /* Small localStorage wrapper that never throws (private mode, blocked storage) */
    store: {
      get: function (k, d) { try { var v = localStorage.getItem('sohoj-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
      set: function (k, v) { try { localStorage.setItem('sohoj-' + k, JSON.stringify(v)); } catch (e) {} },
      del: function (k) { try { localStorage.removeItem('sohoj-' + k); } catch (e) {} }
    },
    copy: function (text, btn) {
      var done = function () {
        if (!btn) return;
        var o = btn.innerHTML; btn.textContent = FT.t('✓ Copied', '✓ কপি হয়েছে');
        setTimeout(function () { btn.innerHTML = o; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, done); return; }
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
    },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    },
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
