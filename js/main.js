/* ==========================================================================
   Osbournes (Set A) — Client-Side Symmetrical Fascia Nav, Chalkboard Filter,
   Accessible WAI-ARIA Menu Tabs, Native <dialog> Lightbox, 1-Tap Occasion
   Presets, Micro-Toast, Dock Clearance & Live Owner-Receipt Booking Ticket
   Zero external network calls · Keyboard accessible · Concept demonstration
   ========================================================================== */

(function () {
  'use strict';

  var DEMO_SUBMIT_TEXT = 'Demo only \u2013 in the live site this would go straight to Osbournes.';

  var reducedMotion = function () {
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /* Helper: Sleek Non-Blocking Micro-Toast */
  var toastTimer = null;
  function showMicroToast(message) {
    var toast = document.getElementById('micro-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3400);
  }

  /* Helper: Date formatting & upcoming weekday ISO */
  function toIso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function nextWeekdayIso(targetDow) {
    var base = new Date();
    var diff = (targetDow - base.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    return toIso(new Date(base.getFullYear(), base.getMonth(), base.getDate() + diff));
  }

  /* 1. Keyboard-Accessible Mobile Fascia Navigation */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  function closeMobileNav(returnFocus) {
    if (!navToggle || !primaryNav) return;
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    var labelEl = navToggle.querySelector('.nav-toggle-text');
    if (labelEl) labelEl.textContent = 'Menu';
    if (returnFocus) {
      navToggle.focus();
    }
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMobileNav(false);
      } else {
        primaryNav.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        var labelEl = navToggle.querySelector('.nav-toggle-text');
        if (labelEl) labelEl.textContent = 'Close';
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        closeMobileNav(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (
        navToggle.getAttribute('aria-expanded') === 'true' &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeMobileNav(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960 && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileNav(false);
      }
    });
  }

  /* 2. Interactive "High Street Chalkboard Slate" Filter (index.html) */
  var chalkButtons = document.querySelectorAll('.chalk-filter-btn[data-chalk-filter]');
  var chalkEntries = document.querySelectorAll('.chalk-entry[data-chalk-category]');
  var chalkStatus = document.getElementById('chalk-status');

  function filterChalkboard(selected, highlightMatch) {
    if (chalkButtons.length === 0 || chalkEntries.length === 0) return;
    var visibleCount = 0;
    var activeLabel = selected;

    chalkButtons.forEach(function (b) {
      var match = b.getAttribute('data-chalk-filter') === selected;
      b.setAttribute('aria-pressed', match ? 'true' : 'false');
      if (match) activeLabel = b.textContent.trim();
    });

    chalkEntries.forEach(function (entry) {
      var cat = entry.getAttribute('data-chalk-category');
      var show = selected === 'all' || cat === selected;
      entry.hidden = !show;
      entry.classList.toggle('is-preset-match', Boolean(highlightMatch && show && selected !== 'all'));
      if (show) visibleCount += 1;
    });

    if (chalkStatus) {
      if (selected === 'all') {
        chalkStatus.textContent = 'Showing all ' + visibleCount + ' High Street house sessions on the board.';
      } else {
        chalkStatus.textContent = 'Showing ' + visibleCount + ' chalkboard listing' + (visibleCount === 1 ? '' : 's') + ' for "' + activeLabel + '".';
      }
    }
  }

  if (chalkButtons.length > 0 && chalkEntries.length > 0) {
    chalkButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterChalkboard(btn.getAttribute('data-chalk-filter'), false);
      });
    });
  }

  /* 3. Accessible WAI-ARIA Tabbed Menu Layout (menus.html) */
  var tabList = document.querySelector('.menu-tablist[role="tablist"]');
  if (tabList) {
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.menu-board-panel[role="tabpanel"]'));

    function activateTab(targetTab, moveFocus) {
      var targetPanelId = targetTab.getAttribute('aria-controls');

      tabs.forEach(function (tab) {
        var selected = tab === targetTab;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.setAttribute('tabindex', selected ? '0' : '-1');
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.id !== targetPanelId;
      });

      if (moveFocus) {
        targetTab.focus();
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab, false);
      });

      tab.addEventListener('keydown', function (event) {
        var nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== null) {
          event.preventDefault();
          activateTab(tabs[nextIndex], true);
        }
      });
    });

    if (window.location.hash) {
      var hashId = window.location.hash.replace('#', '');
      var matchingTab = tabs.find(function (t) {
        return t.getAttribute('aria-controls') === hashId || t.id === hashId;
      });
      if (matchingTab) {
        activateTab(matchingTab, false);
      }
    }
  }

  /* 4. Native <dialog> Photo Lightbox */
  var lightbox = document.getElementById('photo-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCap = document.getElementById('lightbox-caption');
  var lastLightboxOpener = null;

  function openLightbox(src, alt, caption, opener) {
    if (!lightbox || !lightboxImg) return;
    lastLightboxOpener = opener || document.activeElement;
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
    if (lastLightboxOpener && typeof lastLightboxOpener.focus === 'function') {
      lastLightboxOpener.focus({ preventScroll: true });
    }
  }

  if (lightbox) {
    document.querySelectorAll('[data-lightbox-figure]').forEach(function (fig) {
      var triggerOpen = function () {
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
      fig.addEventListener('click', triggerOpen);
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });
    });

    document.querySelectorAll('[data-lightbox-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightbox(
          btn.getAttribute('data-lightbox-src'),
          btn.getAttribute('data-lightbox-alt'),
          btn.getAttribute('data-lightbox-caption'),
          btn
        );
      });
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (btn) {
      btn.addEventListener('click', closeLightbox);
    });

    lightbox.querySelectorAll('[data-lightbox-jump]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof lightbox.close === 'function' && lightbox.open) {
          lightbox.close();
        }
      });
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* 5. 1-Tap Occasion Presets + What's On Quick-Select Buttons */
  var OCCASION_PRESETS = {
    brunch: {
      label: 'Weekend Cobbles Brunch Table',
      chalkFilter: 'brunch',
      scheduleKey: 'brunch',
      bookingType: 'Brunch Table',
      dow: 6,
      time: '10:30',
      guests: '3-4',
      notes: 'Weekend Cobbles Brunch Table \u2013 relaxed High Street morning table request.'
    },
    sport: {
      label: 'Live Sport & Afternoon Booth',
      chalkFilter: 'sport',
      scheduleKey: 'sport',
      bookingType: 'Dining Table',
      dow: 6,
      time: '15:00',
      guests: '5-6',
      notes: 'Live Sport & Afternoon Booth \u2013 clear screen view requested for matchday.'
    },
    snug: {
      label: 'Friday/Saturday Party Snug',
      chalkFilter: 'party',
      scheduleKey: 'snug',
      bookingType: 'Birthday or Group Area',
      dow: 5,
      time: '20:30',
      guests: '7-10',
      notes: 'Friday/Saturday Party Snug \u2013 pre-booked bottle-green booth celebration enquiry.'
    }
  };

  var presetChips = document.querySelectorAll('.occasion-preset-chip[data-occasion-preset]');
  var schedulePanels = document.querySelectorAll('.brass-panel[data-schedule-key]');
  var bookingTypeSelect = document.getElementById('osb-type');

  function applyOccasionPreset(key, shouldScroll, announceToast) {
    var cfg = OCCASION_PRESETS[key];
    if (!cfg) return;

    presetChips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-occasion-preset') === key ? 'true' : 'false');
    });

    // Filter chalkboard on index.html
    filterChalkboard(cfg.chalkFilter, true);

    // Highlight schedule plaque on whats-on-bookings.html
    schedulePanels.forEach(function (panel) {
      panel.classList.toggle('is-preset-match', panel.getAttribute('data-schedule-key') === cfg.scheduleKey);
    });

    // Save for cross-page pre-fill
    try {
      window.sessionStorage.setItem('osbournes_preset', key);
    } catch (err) {
      // Ignore storage restrictions
    }

    // Pre-fill booking form if present on page
    var dateInput = document.getElementById('osb-date');
    var timeSelect = document.getElementById('osb-time');
    var guestsSelect = document.getElementById('osb-guests');
    var notesArea = document.getElementById('osb-notes');
    var formSection = document.getElementById('booking-enquiry');

    if (bookingTypeSelect) bookingTypeSelect.value = cfg.bookingType;
    if (dateInput) dateInput.value = nextWeekdayIso(cfg.dow);
    if (timeSelect) timeSelect.value = cfg.time;
    if (guestsSelect) guestsSelect.value = cfg.guests;
    if (notesArea) notesArea.value = cfg.notes;

    if (formSection && shouldScroll) {
      formSection.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }

    if (announceToast) {
      if (formSection) {
        showMicroToast('Preset applied: ' + cfg.label + ' pre-filled in booking ledger.');
      } else {
        showMicroToast('Slate filtered: ' + cfg.label + ' \u2014 saved for booking ledger.');
      }
    }
  }

  presetChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-occasion-preset');
      var jumpHref = chip.getAttribute('data-preset-jump');
      applyOccasionPreset(key, !jumpHref, true);
      if (jumpHref) {
        window.location.href = jumpHref;
      }
    });
  });

  // Restore saved preset on whats-on-bookings.html arrival
  if (document.getElementById('booking-enquiry')) {
    try {
      var savedPreset = window.sessionStorage.getItem('osbournes_preset');
      if (savedPreset && OCCASION_PRESETS[savedPreset]) {
        window.sessionStorage.removeItem('osbournes_preset');
        applyOccasionPreset(savedPreset, false, true);
      }
    } catch (err) {
      // Ignore
    }
  }

  var bookingTypeButtons = document.querySelectorAll('[data-booking-type]');
  bookingTypeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var chosenType = btn.getAttribute('data-booking-type');
      var formSection = document.getElementById('booking-enquiry');
      if (bookingTypeSelect && chosenType) {
        bookingTypeSelect.value = chosenType;
      }
      if (formSection) {
        formSection.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        var dateInput = document.getElementById('osb-date');
        if (dateInput) {
          window.setTimeout(function () {
            dateInput.focus({ preventScroll: true });
          }, 300);
        }
      }
      showMicroToast('Booking type selected: ' + chosenType);
    });
  });

  /* 6. Accessible Client-Side Validation & Live Digital Enquiry Ticket */
  function validateField(field) {
    var errId = field.getAttribute('aria-describedby');
    var errEl = errId ? document.getElementById(errId) : null;
    var valid = true;
    var msg = '';

    var val = (field.value || '').trim();
    if (field.required && !val) {
      valid = false;
      msg = 'Please complete this required field.';
    } else if (val && field.type === 'email') {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        valid = false;
        msg = 'Please enter a valid email address (for example name@example.co.uk).';
      }
    } else if (val && field.type === 'tel') {
      var digits = val.replace(/\D/g, '');
      if (digits.length < 7) {
        valid = false;
        msg = 'Please enter a valid contact telephone number.';
      }
    }

    if (!valid) {
      field.setAttribute('aria-invalid', 'true');
      if (errEl) {
        errEl.textContent = msg;
        errEl.hidden = false;
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (errEl) {
        errEl.textContent = '';
        errEl.hidden = true;
      }
    }

    return valid;
  }

  function makeRefCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var suffix = '';
    for (var i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'OSB-24-' + suffix;
  }

  function copyPlainText(text, onDone) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {
        fallbackCopy(text, onDone);
      });
    } else {
      fallbackCopy(text, onDone);
    }
  }

  function fallbackCopy(text, onDone) {
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
    if (onDone) onDone();
  }

  function renderOwnerReceiptTicket(confirmEl, form, data) {
    confirmEl.innerHTML = '';

    var verbatimP = document.createElement('p');
    verbatimP.className = 'demo-verbatim-notice';
    verbatimP.textContent = DEMO_SUBMIT_TEXT;
    confirmEl.appendChild(verbatimP);

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

    var rows = [
      ['Guest Name', data.guestName],
      ['Contact', data.contact],
      ['Occasion / Snug Type', data.occasionType],
      ['Preferred Date / Session', data.dateSession],
      ['Party Size & Notes', data.sizeNotes],
      ['Ref Code', data.refCode]
    ];

    rows.forEach(function (pair) {
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
    copyBtn.className = 'btn btn-brass-outline btn-sm';
    copyBtn.textContent = 'Copy Summary';
    copyBtn.addEventListener('click', function () {
      var summaryLines = [
        'Osbournes (24 High Street, Yarm) \u2014 Enquiry Summary',
        'Ref Code: ' + data.refCode,
        'Guest Name: ' + data.guestName,
        'Contact: ' + data.contact,
        'Occasion / Snug Type: ' + data.occasionType,
        'Preferred Date / Session: ' + data.dateSession,
        'Party Size & Notes: ' + data.sizeNotes
      ].join('\n');
      copyPlainText(summaryLines, function () {
        copyBtn.textContent = 'Copied Summary \u2713';
        showMicroToast('Enquiry summary copied to clipboard.');
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
      form.querySelectorAll('.quick-date-chip.is-selected').forEach(function (c) {
        c.classList.remove('is-selected');
      });
      presetChips.forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
      });
      schedulePanels.forEach(function (p) {
        p.classList.remove('is-preset-match');
      });
      confirmEl.hidden = true;
      confirmEl.innerHTML = '';
      var firstInput = form.querySelector('select, input');
      if (firstInput) firstInput.focus();
      showMicroToast('Demo booking form reset.');
    });

    actions.appendChild(copyBtn);
    actions.appendChild(resetBtn);
    ticket.appendChild(actions);

    confirmEl.appendChild(ticket);
  }

  var demoForms = document.querySelectorAll('form[data-demo-form]');
  demoForms.forEach(function (form) {
    var controls = form.querySelectorAll('input, select, textarea');
    var confirmEl = form.querySelector('.form-confirmation');

    controls.forEach(function (control) {
      var evt = control.tagName === 'SELECT' || control.type === 'date' ? 'change' : 'input';
      control.addEventListener(evt, function () {
        if (control.getAttribute('aria-invalid') === 'true') {
          validateField(control);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      controls.forEach(function (control) {
        var ok = validateField(control);
        if (!ok && !firstInvalid) {
          firstInvalid = control;
        }
      });

      if (firstInvalid) {
        if (confirmEl) {
          confirmEl.hidden = true;
        }
        firstInvalid.focus();
        return;
      }

      if (confirmEl) {
        var typeEl = document.getElementById('osb-type');
        var dateEl = document.getElementById('osb-date');
        var timeEl = document.getElementById('osb-time');
        var guestsEl = document.getElementById('osb-guests');
        var nameEl = document.getElementById('osb-name');
        var phoneEl = document.getElementById('osb-phone');
        var emailEl = document.getElementById('osb-email');
        var notesEl = document.getElementById('osb-notes');

        var timeLabel = timeEl && timeEl.options[timeEl.selectedIndex] ? timeEl.options[timeEl.selectedIndex].text : '';
        var guestsLabel = guestsEl && guestsEl.options[guestsEl.selectedIndex] ? guestsEl.options[guestsEl.selectedIndex].text : '';
        var notesText = notesEl && notesEl.value.trim() ? notesEl.value.trim() : 'Standard seating \u2013 no additional dietary/occasion notes';

        renderOwnerReceiptTicket(confirmEl, form, {
          refCode: makeRefCode(),
          guestName: nameEl ? nameEl.value.trim() : '',
          contact: (phoneEl ? phoneEl.value.trim() : '') + ' \u00B7 ' + (emailEl ? emailEl.value.trim() : ''),
          occasionType: typeEl ? typeEl.value : 'Table Enquiry',
          dateSession: (dateEl ? dateEl.value : '') + ' \u00B7 ' + timeLabel,
          sizeNotes: guestsLabel + ' \u2014 ' + notesText
        });

        confirmEl.hidden = false;
        confirmEl.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
        showMicroToast('Enquiry preview generated.');
      }
    });
  });

  /* 7. Gallery Polish: Header Scroll-Progress Hairline, Below-Fold Reveals,
        Quick Date Chips & Mobile Dock Auto-Clearance */
  function initGalleryPolish() {
    var reduced = reducedMotion();

    // 7a. Subtle Top Header Reading-Progress Hairline
    var hdr = document.querySelector('header');
    if (hdr && !hdr.querySelector('.scroll-progress-rail')) {
      var cs = window.getComputedStyle(hdr);
      if (cs.position === 'static') {
        hdr.style.position = 'relative';
      }
      var rail = document.createElement('div');
      rail.className = 'scroll-progress-rail';
      rail.setAttribute('aria-hidden', 'true');
      hdr.appendChild(rail);
      var ticking = false;
      var updateRail = function () {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = docH > 40 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
        rail.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateRail);
        }
      }, { passive: true });
      updateRail();
    }

    // 7b. Smart Form/Footer Auto-Clearance for Mobile Action Bar
    var mobileBar = document.querySelector('.mobile-action-bar');
    if (mobileBar && 'IntersectionObserver' in window) {
      var visibleClearTargets = new Set();
      var clearObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visibleClearTargets.add(entry.target);
          } else {
            visibleClearTargets.delete(entry.target);
          }
        });
        mobileBar.classList.toggle('is-dock-hidden', visibleClearTargets.size > 0);
      }, { threshold: 0.06 });

      document.querySelectorAll('main form, footer.site-footer').forEach(function (el) {
        clearObs.observe(el);
      });
    }

    // 7c. Choreographed Below-the-Fold Scroll Reveals (never hides above-the-fold)
    if (!reduced && 'IntersectionObserver' in window) {
      var targets = document.querySelectorAll('.tavern-plaque, .chalk-entry, .broadsheet-card, .brass-panel, .lookbook-grid-3 .pub-figure');
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

      var vh = window.innerHeight || 800;
      var staggerIdx = 0;
      targets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top > vh * 0.96) {
          el.style.setProperty('--reveal-delay', ((staggerIdx % 3) * 55) + 'ms');
          staggerIdx++;
          el.classList.add('reveal-ready');
          obs.observe(el);
        }
      });

      window.addEventListener('hashchange', function () {
        document.querySelectorAll('.reveal-ready:not(.is-revealed)').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
            el.classList.add('is-revealed');
          }
        });
      });
    }

    // 7d. Mobbin Smart Date Defaults + 1-Tap Quick Date Chips
    var today = new Date();
    var todayIso = toIso(today);
    document.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (!input.min) {
        input.min = todayIso;
      }
      var fieldWrap = input.parentElement;
      if (!fieldWrap || fieldWrap.querySelector('.quick-date-chips')) {
        return;
      }
      var chipRow = document.createElement('div');
      chipRow.className = 'quick-date-chips';
      chipRow.setAttribute('aria-label', 'Quick date options');

      var tmrw = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      var fri = today.getDay() === 5 ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((5 - today.getDay() + 7) % 7));
      var sat = today.getDay() === 6 ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((6 - today.getDay() + 7) % 7));
      var presets = [
        { label: 'Tomorrow', iso: toIso(tmrw) },
        { label: today.getDay() === 5 ? 'Tonight (Fri)' : 'This Friday', iso: toIso(fri) },
        { label: today.getDay() === 6 ? 'Today (Sat)' : 'This Saturday', iso: toIso(sat) }
      ];

      presets.forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-date-chip';
        btn.textContent = p.label;
        btn.addEventListener('click', function () {
          input.value = p.iso;
          chipRow.querySelectorAll('.quick-date-chip').forEach(function (c) {
            c.classList.remove('is-selected');
          });
          btn.classList.add('is-selected');
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        chipRow.appendChild(btn);
      });

      input.insertAdjacentElement('afterend', chipRow);
    });

    // Live factual weekend rhythm highlight on Friday & Saturday plaque
    var d = new Date().getDay();
    if (d === 5 || d === 6) {
      document.querySelectorAll('.tavern-plaque .plaque-kicker').forEach(function (k) {
        if (k.textContent.indexOf('Friday') !== -1 && k.textContent.indexOf('\u2726') === -1) {
          k.textContent = '\u2726 Tonight \u00B7 ' + k.textContent;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryPolish);
  } else {
    initGalleryPolish();
  }
})();
