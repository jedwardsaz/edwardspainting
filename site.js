/* ============================================================
   EDWARDS PAINTING — SITE JS
   Nav (dropdown + mobile flyout) and lead form handling.
   ============================================================ */
(function () {
  // ---------- Services dropdown (desktop hover/click + keyboard) ----------
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var btn = drop.querySelector('button');
    function setOpen(open) {
      drop.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(!drop.classList.contains('open')); });
    // hover open on desktop only
    if (window.matchMedia('(min-width: 881px)').matches) {
      drop.addEventListener('mouseenter', function () { setOpen(true); });
      drop.addEventListener('mouseleave', function () { setOpen(false); });
    }
    drop.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) setOpen(false);
    });
  });

  // ---------- Mobile flyout ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- Lead forms → Web3Forms → edwardspaintingaz@gmail.com ----------
  // Web3Forms catches the submission server-side and emails every field to the
  // inbox tied to this access key. The key is safe to expose in page code — it
  // only permits submitting this form, nothing else.
  var WEB3FORMS_KEY = '9e5136a5-c8af-4436-8758-24edb78bbbeb';

  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot: bots fill this hidden field; silently drop the submission
      var hp = form.querySelector('[name="company_website"]');
      if (hp && hp.value) return;

      // gather the fields the visitor entered
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      // build the Web3Forms payload
      var payload = {
        access_key: WEB3FORMS_KEY,
        // a clear subject line so leads are easy to spot in Gmail
        subject: 'New Estimate Request — ' + (data.project || 'Painting') +
                 (data.city ? ' (' + data.city + ')' : ''),
        from_name: 'Edwards Painting Website',
        // the actual lead details
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        project_type: data.project || '',
        city: data.city || '',
        details: data.message || '',
        promo_code: data.promo || '',
        came_from: data.source || ''
      };

      var btn = form.querySelector('button[type="submit"]');
      var ok = form.querySelector('.form-success');
      var original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          if (ok) ok.classList.add('show');
          form.reset();
          if (btn) btn.textContent = 'Sent ✓';
        } else {
          throw new Error(result.message || 'submit failed');
        }
      })
      .catch(function () {
        // network/hiccup fallback: don't lose the lead — offer the phone number
        if (ok) {
          ok.textContent = "Something went wrong sending that. Please call us at 928-595-2092 and we'll get you taken care of.";
          ok.classList.add('show');
        }
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
    });
  });
})();
