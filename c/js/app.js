/* ==========================================================================
   Osbournes — Concept Set C Interactive Controller
   Sticky pill-tabs, segmented menus, 1-tap weekend date chips & 3-step snug stepper
   Zero external network requests · Client-side demonstration only
   ========================================================================== */

(function () {
  'use strict';

  var DEMO_CONFIRMATION = 'Demo only – in the live site this would go straight to Osbournes.';

  /* 1. Sticky Pill-Tab Active Highlight */
  var hubTabs = document.querySelectorAll('.hub-tab[data-hub-tab]');
  hubTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      hubTabs.forEach(function (t) {
        t.classList.toggle('is-current', t === tab);
      });
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            hubTabs.forEach(function (t) {
              t.classList.toggle('is-current', t.getAttribute('data-hub-tab') === id);
            });
          }
        });
      },
      { rootMargin: '-32% 0px -55% 0px' }
    );

    ['overview', 'menus', 'whats-on', 'book-snug'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* 2. Segmented Menu Control */
  var segBtns = Array.prototype.slice.call(document.querySelectorAll('.seg-menu-btn[role="tab"]'));
  var segPanels = Array.prototype.slice.call(document.querySelectorAll('.menu-app-card[role="tabpanel"]'));

  function activateSegMenu(target, moveFocus) {
    var panelId = target.getAttribute('aria-controls');
    segBtns.forEach(function (btn) {
      var active = btn === target;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });
    segPanels.forEach(function (panel) {
      panel.hidden = panel.id !== panelId;
    });
    if (moveFocus) target.focus();
  }

  segBtns.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      activateSegMenu(btn, false);
    });
    btn.addEventListener('keydown', function (event) {
      var next = null;
      if (event.key === 'ArrowRight') next = (idx + 1) % segBtns.length;
      if (event.key === 'ArrowLeft') next = (idx - 1 + segBtns.length) % segBtns.length;
      if (next !== null) {
        event.preventDefault();
        activateSegMenu(segBtns[next], true);
      }
    });
  });

  /* 3. Mobbin 3-Step Table & Party Snug Stepper */
  var snugStep = 1;
  var snugPanes = document.querySelectorAll('[data-snug-pane]');
  var snugInds = document.querySelectorAll('[data-snug-ind]');
  var spaceRadios = document.querySelectorAll('input[name="seating_space"]');
  var spaceCards = document.querySelectorAll('.space-choice');
  var guestsSelect = document.getElementById('oc-guests');
  var dateInput = document.getElementById('oc-date');
  var occasionSelect = document.getElementById('oc-occasion');
  var summaryBanner = document.getElementById('oc-summary-banner');
  var dateChips = document.querySelectorAll('.date-chip[data-weekday-offset]');

  function nextWeekdayISO(targetDay) {
    var now = new Date();
    var currentDay = now.getDay();
    var diff = (targetDay - currentDay + 7) % 7;
    if (diff === 0) diff = 7;
    var target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    var yyyy = target.getFullYear();
    var mm = String(target.getMonth() + 1).padStart(2, '0');
    var dd = String(target.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  dateChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var targetWeekday = parseInt(chip.getAttribute('data-weekday-offset'), 10);
      if (dateInput) {
        dateInput.value = nextWeekdayISO(targetWeekday);
      }
      dateChips.forEach(function (c) {
        c.classList.toggle('is-picked', c === chip);
      });
      if (occasionSelect) {
        if (targetWeekday === 0) {
          occasionSelect.value = 'Morning Brunch';
        } else {
          occasionSelect.value = 'Birthday / Group Night';
        }
      }
      updateSnugSummary();
    });
  });

  function syncSpaceCards() {
    var checked = document.querySelector('input[name="seating_space"]:checked');
    var val = checked ? checked.value : 'table';
    spaceCards.forEach(function (card) {
      var r = card.querySelector('input[type="radio"]');
      card.classList.toggle('is-selected', Boolean(r && r.value === val));
    });
  }

  function updateSnugSummary() {
    if (!summaryBanner) return;
    var checked = document.querySelector('input[name="seating_space"]:checked');
    var spaceLabel = checked && checked.value === 'snug' ? 'Party Snug / Booth' : 'High Street Table';
    var guests = guestsSelect ? guestsSelect.value : '';
    var occ = occasionSelect ? occasionSelect.value : '';
    var dt = dateInput && dateInput.value ? ' \u00B7 ' + dateInput.value : '';

    summaryBanner.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = 'Enquiry Summary: ';
    summaryBanner.appendChild(strong);
    summaryBanner.appendChild(document.createTextNode(spaceLabel + ' \u00B7 ' + guests + ' \u00B7 ' + occ + dt));
  }

  function goSnugStep(stepNum) {
    snugStep = stepNum;
    snugPanes.forEach(function (p) {
      p.hidden = parseInt(p.getAttribute('data-snug-pane'), 10) !== snugStep;
    });
    snugInds.forEach(function (ind) {
      var n = parseInt(ind.getAttribute('data-snug-ind'), 10);
      ind.classList.toggle('is-active', n === snugStep);
      ind.classList.toggle('is-done', n < snugStep);
    });
    updateSnugSummary();
  }

  spaceRadios.forEach(function (r) {
    r.addEventListener('change', function () {
      syncSpaceCards();
      if (r.value === 'snug' && guestsSelect && guestsSelect.selectedIndex < 3) {
        guestsSelect.value = '7\u201310 guests';
      }
      updateSnugSummary();
    });
  });

  if (guestsSelect) guestsSelect.addEventListener('change', updateSnugSummary);
  if (dateInput) dateInput.addEventListener('change', updateSnugSummary);
  if (occasionSelect) occasionSelect.addEventListener('change', updateSnugSummary);

  document.querySelectorAll('[data-snug-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = parseInt(btn.getAttribute('data-snug-next'), 10);
      if (snugStep === 2 && dateInput && !dateInput.value) {
        var errDate = document.getElementById('err-oc-date');
        if (errDate) {
          errDate.textContent = 'Please select a date or tap one of the weekend chips above.';
          errDate.hidden = false;
        }
        dateInput.focus();
        return;
      }
      var errDateClear = document.getElementById('err-oc-date');
      if (errDateClear) errDateClear.hidden = true;
      goSnugStep(next);
    });
  });

  document.querySelectorAll('[data-snug-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goSnugStep(parseInt(btn.getAttribute('data-snug-prev'), 10));
    });
  });

  document.querySelectorAll('[data-snug-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goSnugStep(parseInt(btn.getAttribute('data-snug-goto'), 10));
    });
  });

  /* Quick Triggers from What's On Cards */
  document.querySelectorAll('[data-quick-space]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sp = btn.getAttribute('data-quick-space');
      var occ = btn.getAttribute('data-quick-occ');
      var radio = document.querySelector('input[name="seating_space"][value="' + sp + '"]');
      if (radio) radio.checked = true;
      syncSpaceCards();
      if (occasionSelect && occ) {
        occasionSelect.value = occ;
      }
      goSnugStep(2);
      var sec = document.getElementById('book-snug');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* 4. Client-Side Dummy Form Submission */
  var form = document.getElementById('osbournes-stepper-form');
  var confirmEl = document.getElementById('oc-confirmation');

  function setErr(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (dateInput && !dateInput.value) {
        goSnugStep(2);
        setErr('err-oc-date', 'Please choose a preferred date.');
        dateInput.focus();
        return;
      }

      goSnugStep(3);
      var nameEl = document.getElementById('oc-name');
      var phoneEl = document.getElementById('oc-phone');
      var emailEl = document.getElementById('oc-email');
      var invalid = null;

      setErr('err-oc-name', '');
      setErr('err-oc-phone', '');
      setErr('err-oc-email', '');

      if (!nameEl.value.trim()) {
        setErr('err-oc-name', 'Please enter your full name.');
        invalid = invalid || nameEl;
      }
      if (!phoneEl.value.trim()) {
        setErr('err-oc-phone', 'Please enter your contact number.');
        invalid = invalid || phoneEl;
      }
      var em = emailEl.value.trim();
      if (!em || em.indexOf('@') === -1 || em.indexOf('.') === -1) {
        setErr('err-oc-email', 'Please enter a valid email address.');
        invalid = invalid || emailEl;
      }

      if (invalid) {
        if (confirmEl) confirmEl.hidden = true;
        invalid.focus();
        return;
      }

      if (confirmEl) {
        confirmEl.textContent = DEMO_CONFIRMATION;
        confirmEl.hidden = false;
      }
    });
  }
})();
