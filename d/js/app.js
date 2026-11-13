/* Osbournes — Concept D: Today at Osbournes (demo only)
   The weekly rhythm below is a structure for the owner to fill in; no fixtures, acts or hours are real. */
(function () {
  'use strict';

  var BASE = [
    { slot: 'AM', name: 'Breakfast & brunch', detail: '[Brunch serving hours – owner to confirm]', type: 'Brunch table' },
    { slot: 'PM', name: 'Pub classics', detail: '[Main kitchen hours – owner to confirm]', type: 'Dining table' }
  ];
  var SPORT = { slot: 'KO', name: 'Live sport', detail: '[Fixture & kick-off – owner to confirm]', type: 'Dining table' };
  var MUSIC = { slot: 'Late', name: 'Live music', detail: '[Act & start time – owner to confirm]', type: 'Birthday or group area', headline: true };

  function lineupFor(d) {
    var dow = d.getDay(), list = BASE.slice();
    if (dow === 0 || dow === 2 || dow === 3 || dow === 6) list.push(SPORT);
    if (dow === 5 || dow === 6) list.push(MUSIC);
    return list;
  }

  var days = [], today = new Date();
  for (var i = 0; i < 7; i++) days.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));

  var daysEl = document.querySelector('[data-days]');
  var lineupEl = document.querySelector('[data-lineup]');
  var daySel = document.querySelector('[data-book-day]');
  var form = document.querySelector('[data-book]');
  var current = 0;

  function longDate(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }

  days.forEach(function (d, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.setAttribute('aria-label', longDate(d));
    b.innerHTML = '<span>' + (i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' })) + '</span><b>' + d.getDate() + '</b>';
    b.addEventListener('click', function () { show(i); });
    daysEl.appendChild(b);
    var o = document.createElement('option');
    o.value = i; o.textContent = longDate(d);
    daySel.appendChild(o);
  });

  function show(i) {
    current = i;
    var d = days[i];
    Array.prototype.forEach.call(daysEl.children, function (c, n) { c.setAttribute('aria-pressed', n === i ? 'true' : 'false'); });
    document.querySelector('[data-day-word]').textContent = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'long' }));
    document.querySelector('[data-day-date]').textContent = longDate(d);
    daySel.value = i;
    lineupEl.textContent = '';
    lineupFor(d).forEach(function (s) {
      var li = document.createElement('li');
      if (s.headline) li.className = 'is-headline';
      li.innerHTML = '<span class="lineup__slot"></span><h3 class="lineup__name"></h3><p class="lineup__detail"><span class="ph"></span></p><a class="lineup__book" href="#book">Book for this</a>';
      li.querySelector('.lineup__slot').textContent = s.slot;
      li.querySelector('.lineup__name').textContent = s.name;
      li.querySelector('.ph').textContent = s.detail;
      li.querySelector('a').addEventListener('click', function () {
        Array.prototype.forEach.call(form.elements.type, function (r) { r.checked = r.value === s.type; });
        daySel.value = current;
      });
      lineupEl.appendChild(li);
    });
  }
  show(0);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, err = document.querySelector('[data-book-error]'), stub = document.querySelector('[data-stub]');
    if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; return; }
    err.hidden = true;
    document.querySelector('[data-stub-who]').textContent = f.name.value.trim() + ' + ' + (f.guests.value === '10+' ? '9 or more' : (parseInt(f.guests.value, 10) - 1));
    document.querySelector('[data-stub-what]').textContent = f.type.value + ' · ' + longDate(days[parseInt(f.day.value, 10)]) + ' · Demo only, nothing sent';
    stub.classList.remove('is-printed'); void stub.offsetWidth; stub.classList.add('is-printed');
    if (window.matchMedia('(max-width: 859px)').matches) stub.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
