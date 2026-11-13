/* ==========================================================================
   Osbournes — Concept Set B Interactive Controller
   Experience snap reel, live slate filter, menu tabs & booking enquiry form
   Zero external network requests · Client-side demonstration only
   ========================================================================== */

(function () {
  'use strict';

  var DEMO_CONFIRMATION = 'Demo only – in the live site this would go straight to Osbournes.';

  /* 1. Experience Snap Reel Controls */
  var expTrack = document.getElementById('exp-track');
  var expPrev = document.getElementById('exp-prev');
  var expNext = document.getElementById('exp-next');

  if (expTrack && expPrev && expNext) {
    expPrev.addEventListener('click', function () {
      expTrack.scrollBy({ left: -330, behavior: 'smooth' });
    });
    expNext.addEventListener('click', function () {
      expTrack.scrollBy({ left: 330, behavior: 'smooth' });
    });
  }

  /* 2. Interactive "What's Pouring & What's On" Dark Slate Filter */
  var slatePills = document.querySelectorAll('.slate-pill[data-slate]');
  var slateItems = document.querySelectorAll('.slate-item[data-slate-cat]');
  var slateMsg = document.getElementById('slate-count-msg');

  slatePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var cat = pill.getAttribute('data-slate');
      var visible = 0;

      slatePills.forEach(function (p) {
        p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
      });

      slateItems.forEach(function (item) {
        var match = cat === 'all' || item.getAttribute('data-slate-cat') === cat;
        item.hidden = !match;
        if (match) visible += 1;
      });

      if (slateMsg) {
        if (cat === 'all') {
          slateMsg.textContent = 'Showing all 5 house sessions on the No. 24 slate.';
        } else {
          slateMsg.textContent = 'Showing ' + visible + ' slate card' + (visible === 1 ? '' : 's') + ' for ' + pill.textContent.trim() + '.';
        }
      }
    });
  });

  /* 3. Accessible Tabbed Menus */
  var menuTabs = Array.prototype.slice.call(document.querySelectorAll('.menu-pill-tab[role="tab"]'));
  var menuPanels = Array.prototype.slice.call(document.querySelectorAll('.menu-slate-panel[role="tabpanel"]'));

  function switchMenuTab(target, focusTab) {
    var panelId = target.getAttribute('aria-controls');
    menuTabs.forEach(function (t) {
      var active = t === target;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    menuPanels.forEach(function (panel) {
      panel.hidden = panel.id !== panelId;
    });
    if (focusTab) target.focus();
  }

  menuTabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      switchMenuTab(tab, false);
    });
    tab.addEventListener('keydown', function (event) {
      var next = null;
      if (event.key === 'ArrowRight') next = (idx + 1) % menuTabs.length;
      if (event.key === 'ArrowLeft') next = (idx - 1 + menuTabs.length) % menuTabs.length;
      if (next !== null) {
        event.preventDefault();
        switchMenuTab(menuTabs[next], true);
      }
    });
  });

  /* 4. Preset Booking Type Buttons */
  var typeSelect = document.getElementById('ob-type');
  var bookSection = document.getElementById('book-snug');

  document.querySelectorAll('[data-preset-booking]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-preset-booking');
      if (typeSelect && val) {
        typeSelect.value = val;
      }
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* 5. Client-Side Dummy Form Validation */
  var form = document.getElementById('osbournes-b-form');
  var confirmEl = document.getElementById('ob-confirmation');

  function setFieldError(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var dateEl = document.getElementById('ob-date');
      var winEl = document.getElementById('ob-window');
      var guestsEl = document.getElementById('ob-guests');
      var nameEl = document.getElementById('ob-name');
      var phoneEl = document.getElementById('ob-phone');
      var emailEl = document.getElementById('ob-email');
      var firstInvalid = null;

      setFieldError('err-ob-date', '');
      setFieldError('err-ob-window', '');
      setFieldError('err-ob-guests', '');
      setFieldError('err-ob-name', '');
      setFieldError('err-ob-phone', '');
      setFieldError('err-ob-email', '');

      if (!dateEl.value) {
        setFieldError('err-ob-date', 'Please choose a preferred date.');
        firstInvalid = firstInvalid || dateEl;
      }
      if (!winEl.value) {
        setFieldError('err-ob-window', 'Please select a session window.');
        firstInvalid = firstInvalid || winEl;
      }
      if (!guestsEl.value) {
        setFieldError('err-ob-guests', 'Please select your group size.');
        firstInvalid = firstInvalid || guestsEl;
      }
      if (!nameEl.value.trim()) {
        setFieldError('err-ob-name', 'Please enter your full name.');
        firstInvalid = firstInvalid || nameEl;
      }
      if (!phoneEl.value.trim()) {
        setFieldError('err-ob-phone', 'Please enter a contact number.');
        firstInvalid = firstInvalid || phoneEl;
      }
      var emailVal = emailEl.value.trim();
      if (!emailVal || emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1) {
        setFieldError('err-ob-email', 'Please enter a valid email address.');
        firstInvalid = firstInvalid || emailEl;
      }

      if (firstInvalid) {
        if (confirmEl) confirmEl.hidden = true;
        firstInvalid.focus();
        return;
      }

      if (confirmEl) {
        confirmEl.textContent = DEMO_CONFIRMATION;
        confirmEl.hidden = false;
      }
    });
  }
})();
