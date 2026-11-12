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
