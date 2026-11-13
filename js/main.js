/* ==========================================================================
   Osbournes — Client-Side Symmetrical Fascia Nav, Chalkboard Slate Filter,
   Accessible WAI-ARIA Menu Tabs & Client-Side Booking Form
   Zero external network calls · Keyboard accessible · Concept demonstration
   ========================================================================== */

(function () {
  'use strict';

  var DEMO_SUBMIT_TEXT = 'Demo only \u2013 in the live site this would go straight to Osbournes.';

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

  if (chalkButtons.length > 0 && chalkEntries.length > 0) {
    chalkButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var selected = btn.getAttribute('data-chalk-filter');
        var visibleCount = 0;

        chalkButtons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        chalkEntries.forEach(function (entry) {
          var cat = entry.getAttribute('data-chalk-category');
          var show = selected === 'all' || cat === selected;
          entry.hidden = !show;
          if (show) visibleCount += 1;
        });

        if (chalkStatus) {
          if (selected === 'all') {
            chalkStatus.textContent = 'Showing all ' + visibleCount + ' High Street house sessions on the board.';
          } else {
            chalkStatus.textContent = 'Showing ' + visibleCount + ' chalkboard listing' + (visibleCount === 1 ? '' : 's') + ' for "' + btn.textContent.trim() + '".';
          }
        }
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

  /* 4. What's On Quick-Select Buttons (whats-on-bookings.html) */
  var bookingTypeButtons = document.querySelectorAll('[data-booking-type]');
  var bookingTypeSelect = document.getElementById('osb-type');

  bookingTypeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var chosenType = btn.getAttribute('data-booking-type');
      var formSection = document.getElementById('booking-enquiry');
      if (bookingTypeSelect && chosenType) {
        bookingTypeSelect.value = chosenType;
      }
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var dateInput = document.getElementById('osb-date');
        if (dateInput) {
          window.setTimeout(function () {
            dateInput.focus({ preventScroll: true });
          }, 300);
        }
      }
    });
  });

  /* 5. Accessible Client-Side Dummy Form Validation & Submission */
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
        confirmEl.textContent = DEMO_SUBMIT_TEXT;
        confirmEl.hidden = false;
        confirmEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
})();

// === Gallery Inspiration Polish (Awwwards / Godly / Mobbin) ===
(function () {
  'use strict';

  function initGalleryPolish() {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Subtle Top Header Reading-Progress Hairline
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

    // 2. Choreographed Below-the-Fold Scroll Reveals (Godly / SiteInspire)
    if (!reduced && 'IntersectionObserver' in window) {
      var targets = document.querySelectorAll('.tavern-plaque, .slate-item, .menu-board-card, .snug-card, .fixture-card');
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
        if (rect.top > vh * 0.94) {
          el.style.setProperty('--reveal-delay', ((staggerIdx % 3) * 55) + 'ms');
          staggerIdx++;
          el.classList.add('reveal-ready');
          obs.observe(el);
        }
      });

      // Safety fallback on hash jump so targeted sections reveal immediately
      window.addEventListener('hashchange', function () {
        document.querySelectorAll('.reveal-ready:not(.is-revealed)').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
            el.classList.add('is-revealed');
          }
        });
      });
    }

    // 3. Mobbin Smart Date Defaults + 1-Tap Quick Date Chips
    function toIso(d) {
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + m + '-' + day;
    }
    function nextWeekday(base, targetDow) {
      var diff = (targetDow - base.getDay() + 7) % 7;
      if (diff === 0) diff = 7;
      return new Date(base.getFullYear(), base.getMonth(), base.getDate() + diff);
    }

    var today = new Date();
    var todayIso = toIso(today);
    document.querySelectorAll('input[type="date"]').forEach(function (input) {
      if (!input.min) {
        input.min = todayIso;
      }
      var fieldWrap = input.parentElement;
      if (!fieldWrap || fieldWrap.querySelector('[data-friday-chips]') || fieldWrap.querySelector('.quick-date-chips')) {
        return;
      }
      var isReturn = input.id === 'return-date';
      var chipRow = document.createElement('div');
      chipRow.className = 'quick-date-chips';
      chipRow.setAttribute('aria-label', 'Quick date options');

      var presets = [];
      if (isReturn) {
        presets = [
          { label: 'Same Day', calc: function () { var o = document.getElementById('outbound-date'); return (o && o.value) ? o.value : todayIso; } },
          { label: '+2 Days', calc: function () {
            var o = document.getElementById('outbound-date');
            var base = (o && o.value) ? new Date(o.value + 'T12:00:00') : today;
            return toIso(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 2));
          } }
        ];
      } else {
        var tmrw = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        var fri = today.getDay() === 5 ? today : nextWeekday(today, 5);
        var sat = today.getDay() === 6 ? today : nextWeekday(today, 6);
        presets = [
          { label: 'Tomorrow', iso: toIso(tmrw) },
          { label: (today.getDay() === 5 ? 'Tonight (Fri)' : 'This Friday'), iso: toIso(fri) },
          { label: (today.getDay() === 6 ? 'Today (Sat)' : 'This Saturday'), iso: toIso(sat) }
        ];
      }

      presets.forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quick-date-chip';
        btn.textContent = p.label;
        btn.addEventListener('click', function () {
          var val = p.calc ? p.calc() : p.iso;
          input.value = val;
          chipRow.querySelectorAll('.quick-date-chip').forEach(function (c) { c.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        chipRow.appendChild(btn);
      });

      input.insertAdjacentElement('afterend', chipRow);
    });

  // Live factual weekend rhythm highlight on Friday & Saturday plaque
  (function () {
    var d = new Date().getDay();
    if (d === 5 || d === 6) {
      var plaques = document.querySelectorAll('.tavern-plaque .plaque-kicker');
      plaques.forEach(function (k) {
        if (k.textContent.indexOf('Friday') !== -1 && k.textContent.indexOf('✦') === -1) {
          k.textContent = '✦ Tonight · ' + k.textContent;
        }
      });
    }
  })();

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryPolish);
  } else {
    initGalleryPolish();
  }
})();
