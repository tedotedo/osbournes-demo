/* ==========================================================================
   Osbournes — Concept Set C Interactive Controller
   Header scroll-progress hairline, sticky pill-tabs, segmented menus, native
   <dialog> lightbox, frosted dock auto-clearance, 1-tap occasion presets +
   micro-toast, 3-step snug stepper & live owner-receipt booking ticket
   Zero external network requests · Client-side demonstration only
   ========================================================================== */

(function () {
  'use strict';

  var DEMO_CONFIRMATION = 'Demo only \u2013 in the live site this would go straight to Osbournes.';

  function isReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* Helper: Sleek Non-Blocking Micro-Toast */
  var toastTimer = null;
  function showToast(msg) {
    var toast = document.getElementById('micro-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3400);
  }

  function toIso(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function nextWeekdayISO(targetDay) {
    var now = new Date();
    var currentDay = now.getDay();
    var diff = (targetDay - currentDay + 7) % 7;
    if (diff === 0) diff = 7;
    return toIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff));
  }

  /* 1. Sticky Header 2.5px Scroll-Progress Hairline */
  var scrollRail = document.getElementById('c-scroll-rail');
  if (scrollRail) {
    var railTicking = false;
    var updateScrollRail = function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = docH > 40 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      scrollRail.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      railTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!railTicking) {
        railTicking = true;
        window.requestAnimationFrame(updateScrollRail);
      }
    }, { passive: true });
    window.addEventListener('resize', updateScrollRail);
    updateScrollRail();
  }

  /* 2. Sticky Pill-Tab Active Highlight */
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

  /* 3. Segmented Menu Control */
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

  /* 4. Native <dialog> Photo Lightbox */
  var lightbox = document.getElementById('photo-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCap = document.getElementById('lightbox-caption');
  var lightboxOpener = null;

  function openLightbox(src, alt, caption, opener) {
    if (!lightbox || !lightboxImg) return;
    lightboxOpener = opener || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Illustrative venue photograph';
    if (lightboxCap) {
      lightboxCap.textContent = caption || 'Illustrative image — concept preview for Osbournes.';
    }
    if (typeof lightbox.showModal === 'function') {
      if (!lightbox.open) lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function' && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
    if (lightboxOpener && typeof lightboxOpener.focus === 'function') {
      lightboxOpener.focus({ preventScroll: true });
    }
  }

  if (lightbox) {
    document.querySelectorAll('[data-lightbox-figure]').forEach(function (fig) {
      var trigger = function () {
        var img = fig.querySelector('img');
        var cap = fig.querySelector('figcaption');
        if (!img) return;
        openLightbox(
          img.getAttribute('src'),
          img.getAttribute('alt'),
          cap ? cap.textContent.trim() : '',
          fig
        );
      };
      fig.addEventListener('click', trigger);
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger();
        }
      });
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (btn) {
      btn.addEventListener('click', closeLightbox);
    });

    lightbox.querySelectorAll('[data-lightbox-jump]').forEach(function (cta) {
      cta.addEventListener('click', function () {
        if (typeof lightbox.close === 'function' && lightbox.open) {
          lightbox.close();
        }
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* 5. Floating Frosted Dock Auto-Clearance on Form / Footer Intersection */
  var mobileDock = document.querySelector('.hub-mobile-dock');
  if (mobileDock && 'IntersectionObserver' in window) {
    var clearSet = new Set();
    var dockIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          clearSet.add(entry.target);
        } else {
          clearSet.delete(entry.target);
        }
      });
      mobileDock.classList.toggle('is-dock-hidden', clearSet.size > 0);
    }, { threshold: 0.06 });

    document.querySelectorAll('#osbournes-stepper-form, footer.hub-footer').forEach(function (el) {
      dockIo.observe(el);
    });
  }

  /* 6. Mobbin 3-Step Table & Party Snug Stepper + 1-Tap Occasion Presets */
  var snugStep = 1;
  var snugPanes = document.querySelectorAll('[data-snug-pane]');
  var snugInds = document.querySelectorAll('[data-snug-ind]');
  var spaceRadios = document.querySelectorAll('input[name="seating_space"]');
  var spaceCards = document.querySelectorAll('.space-choice');
  var guestsSelect = document.getElementById('oc-guests');
  var dateInput = document.getElementById('oc-date');
  var occasionSelect = document.getElementById('oc-occasion');
  var notesInput = document.getElementById('oc-notes');
  var summaryBanner = document.getElementById('oc-summary-banner');
  var dateChips = document.querySelectorAll('.date-chip[data-weekday-offset]');
  var presetChips = document.querySelectorAll('.hub-preset-chip[data-occasion-preset]');
  var whatsonCards = document.querySelectorAll('.whatson-card[data-whatson-key]');

  if (dateInput) {
    dateInput.min = toIso(new Date());
  }

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
        occasionSelect.value = targetWeekday === 0 ? 'Morning Brunch' : 'Birthday / Group Night';
      }
      var errDateClear = document.getElementById('err-oc-date');
      if (errDateClear) errDateClear.hidden = true;
      updateSnugSummary();
    });
  });

  var HUB_PRESETS = {
    brunch: {
      label: 'Weekend Cobbles Brunch Table',
      space: 'table',
      guests: '3\u20134 guests',
      dow: 6,
      occ: 'Morning Brunch',
      notes: 'Weekend Cobbles Brunch Table \u2013 morning High Street table request.'
    },
    sport: {
      label: 'Live Sport & Afternoon Booth',
      space: 'table',
      guests: '5\u20136 guests',
      dow: 6,
      occ: 'Live Sport Fixture',
      notes: 'Live Sport & Afternoon Booth \u2013 clear screen view requested for matchday.'
    },
    snug: {
      label: 'Friday/Saturday Party Snug',
      space: 'snug',
      guests: '7\u201310 guests',
      dow: 5,
      occ: 'Birthday / Group Night',
      notes: 'Friday/Saturday Party Snug \u2013 pre-booked bottle-green booth celebration.'
    }
  };

  presetChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-occasion-preset');
      var cfg = HUB_PRESETS[key];
      if (!cfg) return;

      presetChips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-occasion-preset') === key ? 'true' : 'false');
      });

      whatsonCards.forEach(function (card) {
        card.classList.toggle('is-preset-match', card.getAttribute('data-whatson-key') === key);
      });

      var radio = document.querySelector('input[name="seating_space"][value="' + cfg.space + '"]');
      if (radio) radio.checked = true;
      syncSpaceCards();

      if (guestsSelect) guestsSelect.value = cfg.guests;
      if (dateInput) dateInput.value = nextWeekdayISO(cfg.dow);
      if (occasionSelect) occasionSelect.value = cfg.occ;
      if (notesInput) notesInput.value = cfg.notes;

      var errDate = document.getElementById('err-oc-date');
      if (errDate) errDate.hidden = true;

      goSnugStep(3);
      showToast('Preset applied: ' + cfg.label + ' pre-filled in Step 3.');
    });
  });

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
      if (sec) sec.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      showToast('Selected: ' + occ);
    });
  });

  /* 7. Choreographed Below-the-Fold Reveals */
  if (!isReducedMotion() && 'IntersectionObserver' in window) {
    var revEls = document.querySelectorAll('.whatson-card, .menu-app-card, .snug-stepper-card, .visit-card');
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    var vh = window.innerHeight || 844;
    revEls.forEach(function (el, idx) {
      if (el.getBoundingClientRect().top > vh * 0.96) {
        el.style.setProperty('--reveal-delay', ((idx % 3) * 55) + 'ms');
        el.classList.add('reveal-ready');
        revObs.observe(el);
      }
    });
  }

  /* 8. Client-Side Validation & Live Owner-Receipt Summary Ticket */
  var form = document.getElementById('osbournes-stepper-form');
  var confirmEl = document.getElementById('oc-confirmation');

  function setErr(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function makeRefCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'OSB-24-' + code;
  }

  function copySummaryText(text, done) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      // Ignore
    }
    document.body.removeChild(ta);
    if (done) done();
  }

  function renderReceiptTicket(data) {
    if (!confirmEl || !form) return;
    confirmEl.innerHTML = '';

    var notice = document.createElement('p');
    notice.className = 'demo-verbatim-notice';
    notice.textContent = DEMO_CONFIRMATION;
    confirmEl.appendChild(notice);

    var ticket = document.createElement('div');
    ticket.className = 'receipt-ticket';

    var head = document.createElement('div');
    head.className = 'receipt-ticket-head';

    var title = document.createElement('span');
    title.className = 'receipt-ticket-title';
    title.textContent = 'What Osbournes Receives';

    var badge = document.createElement('span');
    badge.className = 'receipt-ref-badge';
    badge.textContent = 'Ref: ' + data.refCode;

    head.appendChild(title);
    head.appendChild(badge);
    ticket.appendChild(head);

    var dl = document.createElement('dl');
    dl.className = 'receipt-dl';

    [
      ['Guest Name', data.guestName],
      ['Contact', data.contact],
      ['Occasion / Snug Type', data.occasionType],
      ['Preferred Date / Session', data.dateSession],
      ['Party Size & Notes', data.sizeNotes],
      ['Ref Code', data.refCode]
    ].forEach(function (pair) {
      var cell = document.createElement('div');
      var dt = document.createElement('dt');
      dt.textContent = pair[0];
      var dd = document.createElement('dd');
      dd.textContent = pair[1];
      cell.appendChild(dt);
      cell.appendChild(dd);
      dl.appendChild(cell);
    });

    ticket.appendChild(dl);

    var actions = document.createElement('div');
    actions.className = 'receipt-actions';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-coach-outline btn-sm';
    copyBtn.textContent = 'Copy Summary';
    copyBtn.addEventListener('click', function () {
      var plain = [
        'Osbournes (24 High Street, Yarm) \u2014 Enquiry Summary',
        'Ref Code: ' + data.refCode,
        'Guest Name: ' + data.guestName,
        'Contact: ' + data.contact,
        'Occasion / Snug Type: ' + data.occasionType,
        'Preferred Date / Session: ' + data.dateSession,
        'Party Size & Notes: ' + data.sizeNotes
      ].join('\n');
      copySummaryText(plain, function () {
        copyBtn.textContent = 'Copied Summary \u2713';
        showToast('Enquiry summary copied to clipboard.');
        window.setTimeout(function () {
          copyBtn.textContent = 'Copy Summary';
        }, 2200);
      });
    });

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-copper btn-sm';
    resetBtn.textContent = 'Reset Demo';
    resetBtn.addEventListener('click', function () {
      form.reset();
      dateChips.forEach(function (c) {
        c.classList.remove('is-picked');
      });
      presetChips.forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
      });
      whatsonCards.forEach(function (card) {
        card.classList.remove('is-preset-match');
      });
      syncSpaceCards();
      confirmEl.hidden = true;
      confirmEl.innerHTML = '';
      goSnugStep(1);
      showToast('Demo stepper reset.');
    });

    actions.appendChild(copyBtn);
    actions.appendChild(resetBtn);
    ticket.appendChild(actions);

    confirmEl.appendChild(ticket);
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
      if (phoneEl.value.replace(/\D/g, '').length < 7) {
        setErr('err-oc-phone', 'Please enter a valid contact number.');
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

      var checkedSpace = document.querySelector('input[name="seating_space"]:checked');
      var spaceLabel = checkedSpace && checkedSpace.value === 'snug' ? 'Party Snug / Booth' : 'High Street Table';
      var occLabel = occasionSelect && occasionSelect.options[occasionSelect.selectedIndex] ? occasionSelect.options[occasionSelect.selectedIndex].text : (occasionSelect ? occasionSelect.value : '');
      var noteVal = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'Standard seating \u2013 no extra notes';

      renderReceiptTicket({
        refCode: makeRefCode(),
        guestName: nameEl.value.trim(),
        contact: phoneEl.value.trim() + ' \u00B7 ' + em,
        occasionType: spaceLabel + ' \u00B7 ' + occLabel,
        dateSession: dateInput.value + ' \u00B7 ' + occLabel,
        sizeNotes: (guestsSelect ? guestsSelect.value : '') + ' \u2014 ' + noteVal
      });

      if (confirmEl) {
        confirmEl.hidden = false;
        confirmEl.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }
      showToast('Enquiry receipt generated.');
    });
  }
})();
