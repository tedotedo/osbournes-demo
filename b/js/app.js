/* ==========================================================================
   Osbournes — Concept Set B Interactive Controller
   4-frame lookbook snap reel (01/04 counter + arrows + dots), native <dialog>
   lightbox, header scroll-progress hairline, frosted dock auto-clearance,
   1-tap occasion presets + micro-toast, menu tabs & live receipt booking ticket
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
    var el = document.getElementById('micro-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('is-visible');
    }, 3400);
  }

  function toIso(d) {
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function nextWeekdayIso(targetDow) {
    var now = new Date();
    var diff = (targetDow - now.getDay() + 7) % 7;
    if (diff === 0) diff = 7;
    return toIso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff));
  }

  /* 1. Sticky Header 2.5px Scroll-Progress Hairline */
  var scrollRail = document.getElementById('b-scroll-rail');
  if (scrollRail) {
    var railTicking = false;
    var updateScrollRail = function () {
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = maxScroll > 40 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
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

  /* 2. Experience Snap Reel Controls (01 / 04 Counter + Arrows + Active Dots) */
  var expTrack = document.getElementById('exp-track');
  var expPrev = document.getElementById('exp-prev');
  var expNext = document.getElementById('exp-next');
  var expCounter = document.getElementById('exp-counter');
  var expDots = Array.prototype.slice.call(document.querySelectorAll('[data-reel-dot]'));

  if (expTrack) {
    var expCards = Array.prototype.slice.call(expTrack.querySelectorAll('.exp-card'));
    var totalFrames = expCards.length;
    var activeFrame = 0;
    var programmaticLock = false;

    var renderReelState = function (idx) {
      activeFrame = Math.max(0, Math.min(totalFrames - 1, idx));
      if (expCounter) {
        var curStr = String(activeFrame + 1).padStart(2, '0');
        var totStr = String(totalFrames).padStart(2, '0');
        expCounter.textContent = curStr + ' / ' + totStr;
      }
      expDots.forEach(function (dot, i) {
        var isCurrent = i === activeFrame;
        dot.classList.toggle('is-active', isCurrent);
        if (isCurrent) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
      if (expPrev) expPrev.disabled = activeFrame <= 0;
      if (expNext) expNext.disabled = activeFrame >= totalFrames - 1;
    };

    var goToFrame = function (targetIdx) {
      var clamped = Math.max(0, Math.min(totalFrames - 1, targetIdx));
      renderReelState(clamped);
      var maxLeft = Math.max(0, expTrack.scrollWidth - expTrack.clientWidth);
      if (maxLeft > 4 && expCards[clamped]) {
        var rawLeft = expCards[clamped].offsetLeft - expCards[0].offsetLeft;
        var dest = clamped === totalFrames - 1 ? maxLeft : Math.min(maxLeft, rawLeft);
        programmaticLock = true;
        expTrack.scrollTo({
          left: dest,
          behavior: isReducedMotion() ? 'auto' : 'smooth'
        });
        window.setTimeout(function () {
          programmaticLock = false;
        }, 420);
      }
    };

    if (expPrev) {
      expPrev.addEventListener('click', function () {
        goToFrame(activeFrame - 1);
      });
    }
    if (expNext) {
      expNext.addEventListener('click', function () {
        goToFrame(activeFrame + 1);
      });
    }
    expDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-reel-dot'), 10);
        if (!isNaN(idx)) goToFrame(idx);
      });
    });

    var reelTicking = false;
    expTrack.addEventListener('scroll', function () {
      if (programmaticLock || reelTicking) return;
      reelTicking = true;
      window.requestAnimationFrame(function () {
        var maxLeft = Math.max(0, expTrack.scrollWidth - expTrack.clientWidth);
        if (maxLeft > 8) {
          var sLeft = expTrack.scrollLeft;
          if (sLeft >= maxLeft - 10) {
            renderReelState(totalFrames - 1);
          } else {
            var bestIdx = 0;
            var bestDist = Infinity;
            var baseOffset = expCards[0] ? expCards[0].offsetLeft : 0;
            expCards.forEach(function (card, i) {
              var dist = Math.abs((card.offsetLeft - baseOffset) - sLeft);
              if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
              }
            });
            renderReelState(bestIdx);
          }
        }
        reelTicking = false;
      });
    }, { passive: true });

    renderReelState(0);
  }

  /* 3. Native <dialog> Photo Lightbox */
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

  /* 4. Interactive "What's Pouring & What's On" Dark Slate Filter */
  var slatePills = document.querySelectorAll('.slate-pill[data-slate]');
  var slateItems = document.querySelectorAll('.slate-item[data-slate-cat]');
  var slateMsg = document.getElementById('slate-count-msg');

  function applySlateFilter(cat, highlightMatches) {
    var visible = 0;
    var activeLabel = cat;

    slatePills.forEach(function (p) {
      var active = p.getAttribute('data-slate') === cat;
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) activeLabel = p.textContent.trim();
    });

    slateItems.forEach(function (item) {
      var match = cat === 'all' || item.getAttribute('data-slate-cat') === cat;
      item.hidden = !match;
      item.classList.toggle('is-preset-match', Boolean(highlightMatches && match && cat !== 'all'));
      if (match) visible += 1;
    });

    if (slateMsg) {
      if (cat === 'all') {
        slateMsg.textContent = 'Showing all 5 house sessions on the No. 24 slate.';
      } else {
        slateMsg.textContent = 'Showing ' + visible + ' slate card' + (visible === 1 ? '' : 's') + ' for ' + activeLabel + '.';
      }
    }
  }

  slatePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      applySlateFilter(pill.getAttribute('data-slate'), false);
    });
  });

  /* 5. 1-Tap Occasion Presets + Quick Date Chips */
  var PRESET_MAP = {
    brunch: {
      label: 'Weekend Cobbles Brunch Table',
      slate: 'brunch',
      type: 'Brunch Table',
      dow: 6,
      window: 'morning-brunch',
      guests: '3-4',
      notes: 'Weekend Cobbles Brunch Table \u2013 morning High Street table request.'
    },
    sport: {
      label: 'Live Sport & Afternoon Booth',
      slate: 'sport',
      type: 'Dining / Matchday Table',
      dow: 6,
      window: 'afternoon-sport',
      guests: '5-6',
      notes: 'Live Sport & Afternoon Booth \u2013 clear screen view requested for matchday.'
    },
    snug: {
      label: 'Friday/Saturday Party Snug',
      slate: 'snugs',
      type: 'Party Snug / Birthday Booth',
      dow: 5,
      window: 'weekend-night',
      guests: '7-10',
      notes: 'Friday/Saturday Party Snug \u2013 pre-booked bottle-green booth celebration.'
    }
  };

  var occasionChips = document.querySelectorAll('.occasion-chip[data-occasion-preset]');
  var typeSelect = document.getElementById('ob-type');
  var dateEl = document.getElementById('ob-date');
  var winEl = document.getElementById('ob-window');
  var guestsEl = document.getElementById('ob-guests');
  var notesEl = document.getElementById('ob-notes');
  var bookSection = document.getElementById('book-snug');

  if (dateEl) {
    var today = new Date();
    dateEl.min = toIso(today);
    var dateWrap = dateEl.parentElement;
    if (dateWrap && !dateWrap.querySelector('.quick-date-chips')) {
      var qRow = document.createElement('div');
      qRow.className = 'quick-date-chips';
      qRow.setAttribute('aria-label', 'Quick date options');
      var tmrw = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
      var qPresets = [
        { label: 'Tomorrow', iso: tmrw },
        { label: 'This Friday', iso: nextWeekdayIso(5) },
        { label: 'This Saturday', iso: nextWeekdayIso(6) }
      ];
      qPresets.forEach(function (qp) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'quick-date-chip';
        b.textContent = qp.label;
        b.addEventListener('click', function () {
          dateEl.value = qp.iso;
          qRow.querySelectorAll('.quick-date-chip').forEach(function (c) {
            c.classList.toggle('is-selected', c === b);
          });
          setFieldError('err-ob-date', '');
        });
        qRow.appendChild(b);
      });
      dateEl.insertAdjacentElement('afterend', qRow);
    }
  }

  occasionChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-occasion-preset');
      var cfg = PRESET_MAP[key];
      if (!cfg) return;

      occasionChips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-occasion-preset') === key ? 'true' : 'false');
      });

      applySlateFilter(cfg.slate, true);

      if (typeSelect) typeSelect.value = cfg.type;
      if (dateEl) dateEl.value = nextWeekdayIso(cfg.dow);
      if (winEl) winEl.value = cfg.window;
      if (guestsEl) guestsEl.value = cfg.guests;
      if (notesEl) notesEl.value = cfg.notes;

      setFieldError('err-ob-date', '');
      setFieldError('err-ob-window', '');
      setFieldError('err-ob-guests', '');

      showToast('Preset applied: ' + cfg.label + ' pre-filled below.');
    });
  });

  /* 6. Accessible Tabbed Menus */
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

  /* 7. Preset Booking Type Buttons on Cards */
  document.querySelectorAll('[data-preset-booking]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-preset-booking');
      if (typeSelect && val) {
        typeSelect.value = val;
      }
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
      showToast('Selected: ' + val);
    });
  });

  /* 8. Floating Velvet Dock Auto-Clearance on Form / Footer Intersection */
  var velvetDock = document.querySelector('.velvet-dock');
  if (velvetDock && 'IntersectionObserver' in window) {
    var intersectingClearSet = new Set();
    var dockObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          intersectingClearSet.add(entry.target);
        } else {
          intersectingClearSet.delete(entry.target);
        }
      });
      velvetDock.classList.toggle('is-dock-hidden', intersectingClearSet.size > 0);
    }, { threshold: 0.06 });

    document.querySelectorAll('#osbournes-b-form, footer.velvet-footer').forEach(function (target) {
      dockObserver.observe(target);
    });
  }

  /* 9. Below-the-Fold Scroll Reveals (never hides above-the-fold) */
  if (!isReducedMotion() && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll('.slate-item, .menu-slate-panel, .copper-booking-card');
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    var vh = window.innerHeight || 844;
    revealTargets.forEach(function (el, idx) {
      if (el.getBoundingClientRect().top > vh * 0.96) {
        el.style.setProperty('--reveal-delay', ((idx % 3) * 55) + 'ms');
        el.classList.add('reveal-ready');
        revObs.observe(el);
      }
    });
  }

  /* 10. Client-Side Validation & Live Digital Enquiry Ticket */
  var form = document.getElementById('osbournes-b-form');
  var confirmEl = document.getElementById('ob-confirmation');

  function setFieldError(id, msg) {
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

  function copyText(text, done) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopyText(text, done);
      });
    } else {
      fallbackCopyText(text, done);
    }
  }

  function fallbackCopyText(text, done) {
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

  function renderReceipt(data) {
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
      var wrap = document.createElement('div');
      var dt = document.createElement('dt');
      dt.textContent = pair[0];
      var dd = document.createElement('dd');
      dd.textContent = pair[1];
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    });

    ticket.appendChild(dl);

    var actions = document.createElement('div');
    actions.className = 'receipt-actions';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-velvet-outline btn-compact';
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
      copyText(plain, function () {
        copyBtn.textContent = 'Copied Summary \u2713';
        showToast('Enquiry summary copied to clipboard.');
        window.setTimeout(function () {
          copyBtn.textContent = 'Copy Summary';
        }, 2200);
      });
    });

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-copper btn-compact';
    resetBtn.textContent = 'Reset Demo';
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.quick-date-chip.is-selected').forEach(function (c) {
        c.classList.remove('is-selected');
      });
      occasionChips.forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
      });
      applySlateFilter('all', false);
      confirmEl.hidden = true;
      confirmEl.innerHTML = '';
      if (typeSelect) typeSelect.focus();
      showToast('Demo enquiry form reset.');
    });

    actions.appendChild(copyBtn);
    actions.appendChild(resetBtn);
    ticket.appendChild(actions);

    confirmEl.appendChild(ticket);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

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
      if (phoneEl.value.replace(/\D/g, '').length < 7) {
        setFieldError('err-ob-phone', 'Please enter a valid contact number.');
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

      var winLabel = winEl.options[winEl.selectedIndex] ? winEl.options[winEl.selectedIndex].text : winEl.value;
      var guestsLabel = guestsEl.options[guestsEl.selectedIndex] ? guestsEl.options[guestsEl.selectedIndex].text : guestsEl.value;
      var typeLabel = typeSelect.options[typeSelect.selectedIndex] ? typeSelect.options[typeSelect.selectedIndex].text : typeSelect.value;
      var noteVal = notesEl && notesEl.value.trim() ? notesEl.value.trim() : 'Standard seating \u2013 no extra notes';

      renderReceipt({
        refCode: makeRefCode(),
        guestName: nameEl.value.trim(),
        contact: phoneEl.value.trim() + ' \u00B7 ' + emailVal,
        occasionType: typeLabel,
        dateSession: dateEl.value + ' \u00B7 ' + winLabel,
        sizeNotes: guestsLabel + ' \u2014 ' + noteVal
      });

      if (confirmEl) {
        confirmEl.hidden = false;
        confirmEl.scrollIntoView({ behavior: isReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }
      showToast('Enquiry receipt generated.');
    });
  }
})();
