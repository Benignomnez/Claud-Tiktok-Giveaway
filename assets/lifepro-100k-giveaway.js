(function () {
  var root = document.querySelector('[data-lp-giveaway]');
  if (!root) return;

  var endDate = new Date(root.getAttribute('data-end-date')).getTime();
  var promoCode = root.getAttribute('data-promo-code') || 'THANKYOU100';

  var daysEl = root.querySelector('[data-lp-days]');
  var hoursEl = root.querySelector('[data-lp-hours]');
  var minsEl = root.querySelector('[data-lp-mins]');
  var secsEl = root.querySelector('[data-lp-secs]');
  var heroCountEl = root.querySelector('[data-lp-hero-count]');
  var marqueeEls = root.querySelectorAll('[data-lp-marquee]');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var diff = Math.max(0, endDate - Date.now());
    var day = 86400000, hr = 3600000, min = 60000;
    var d = Math.floor(diff / day); diff -= d * day;
    var h = Math.floor(diff / hr); diff -= h * hr;
    var m = Math.floor(diff / min); diff -= m * min;
    var s = Math.floor(diff / 1000);

    if (daysEl) daysEl.textContent = pad(d);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
    if (heroCountEl) {
      heroCountEl.textContent = (endDate - Date.now() <= 0) ? 'Closed' : (d + 'd ' + h + 'h ' + pad(m) + 'm');
    }

    var closed = (endDate - Date.now() <= 0);
    var msg = closed
      ? '★  Entries are now closed — winners announced soon. Watch @lifeprousa  ★  Thank you for celebrating 100K with us  '
      : '★  Giveaway ends in ' + d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's  ★  Enter now on Instagram  ★  10 winners • No purchase necessary  ';
    marqueeEls.forEach(function (el) { el.textContent = msg; });
  }

  tick();
  setInterval(tick, 1000);

  var toggleAllBtn = root.querySelector('[data-lp-toggle-all]');
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', function () {
      var items = Array.prototype.slice.call(root.querySelectorAll('#rules details'));
      var anyClosed = items.some(function (d) { return !d.open; });
      items.forEach(function (d) { d.open = anyClosed; });
      toggleAllBtn.textContent = anyClosed ? 'Collapse All' : 'Expand All';
    });
  }

  var copyBtn = root.querySelector('[data-lp-copy-code]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      try {
        if (navigator.clipboard) navigator.clipboard.writeText(promoCode);
      } catch (e) {}
      var prev = copyBtn.textContent;
      copyBtn.textContent = 'Copied ✓';
      setTimeout(function () { copyBtn.textContent = prev; }, 2000);
    });
  }

  var revealEls = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && revealEls.length) {
    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s var(--lp-ease-out), transform 0.6s var(--lp-ease-out)';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
