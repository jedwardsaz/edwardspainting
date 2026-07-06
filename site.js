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

  // ---------- Lead forms ----------
  // ============================================================
  // BACKEND WIRING (Twilio / Mailchimp)
  // Replace the mailto fallback below with a POST to your endpoint:
  //
  //   fetch('https://YOUR-BACKEND/lead', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)   // `data` is built below
  //   })
  //
  // Every form sends: name, phone, email, project, city, message,
  // source ("home-sticky" | "qr-landing"), promo.
  // Leads should be delivered to: edwardspaintingaz@gmail.com
  // ============================================================
  var LEAD_EMAIL = 'edwardspaintingaz@gmail.com';

  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot: bots fill this hidden field; silently drop
      if (form.querySelector('[name="company_website"]') &&
          form.querySelector('[name="company_website"]').value) return;

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      // --- TEMPORARY FALLBACK until the backend is wired ---
      // Opens a pre-filled email so no lead is lost pre-launch.
      var subject = 'Estimate request — ' + (data.project || 'Painting project');
      var body = [
        'Name: ' + (data.name || ''),
        'Phone: ' + (data.phone || ''),
        'Email: ' + (data.email || ''),
        'Project type: ' + (data.project || ''),
        'City: ' + (data.city || ''),
        'Details: ' + (data.message || ''),
        'Promo: ' + (data.promo || ''),
        'Source: ' + (data.source || '')
      ].join('\n');
      window.location.href = 'mailto:' + LEAD_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      // --- END TEMPORARY FALLBACK ---

      var ok = form.querySelector('.form-success');
      if (ok) ok.classList.add('show');
    });
  });
})();
