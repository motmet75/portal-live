(function () {
  'use strict';

  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
  }
  document.querySelectorAll('[data-nav] a').forEach(function (link) {
    link.addEventListener('click', function () { if (nav) nav.classList.remove('open'); });
  });

  var tour = document.querySelector('[data-estate-tour]');
  if (!tour) return;

  var stage = tour.querySelector('[data-tour-scenes]');
  var scenes = Array.prototype.slice.call(tour.querySelectorAll('[data-tour-scene]'));
  var controls = Array.prototype.slice.call(tour.querySelectorAll('[data-tour-go]'));
  var dots = Array.prototype.slice.call(tour.querySelectorAll('.tour-dots [data-tour-go]'));
  var lookControls = Array.prototype.slice.call(tour.querySelectorAll('[data-look]'));
  var backControl = tour.querySelector('[data-tour-back]');
  var counter = tour.querySelector('[data-tour-counter]');
  var title = tour.querySelector('[data-tour-title]');
  var progress = tour.querySelector('[data-tour-progress]');
  var active = 0;
  var ticking = false;
  var dragging = false;
  var startX = 0;
  var startY = 0;
  var views = scenes.map(function () { return { x: 50, y: 50 }; });

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function wrap(value) { return ((value % 100) + 100) % 100; }

  function renderView(index) {
    scenes[index].style.setProperty('--view-x', views[index].x + '%');
    scenes[index].style.setProperty('--view-y', views[index].y + '%');
  }

  function setScene(index) {
    index = clamp(index, 0, scenes.length - 1);
    if (index === active && scenes[index].classList.contains('is-active')) return;
    active = index;
    scenes.forEach(function (scene, sceneIndex) {
      var selected = sceneIndex === active;
      scene.classList.toggle('is-active', selected);
      scene.setAttribute('aria-hidden', selected ? 'false' : 'true');
    });
    dots.forEach(function (dot, dotIndex) { dot.classList.toggle('is-active', dotIndex === active); });
    counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(scenes.length).padStart(2, '0');
    title.textContent = scenes[active].getAttribute('data-title');
  }

  function updateFromScroll() {
    var travel = Math.max(1, tour.offsetHeight - window.innerHeight);
    var ratio = clamp(-tour.getBoundingClientRect().top / travel, 0, 1);
    setScene(Math.min(scenes.length - 1, Math.floor(ratio * scenes.length)));
    progress.style.transform = 'scaleX(' + (0.2 + ratio * 0.8) + ')';
    var local = (ratio * scenes.length) % 1;
    scenes[active].style.setProperty('--scene-scale', String(1.08 + local * 0.11));
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateFromScroll);
    }
  }

  function goTo(index) {
    var travel = Math.max(1, tour.offsetHeight - window.innerHeight);
    var top = tour.getBoundingClientRect().top + window.scrollY + travel * (index / (scenes.length - 1));
    window.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  controls.forEach(function (control) {
    control.addEventListener('click', function () { goTo(Number(control.getAttribute('data-tour-go'))); });
  });

  lookControls.forEach(function (control) {
    control.addEventListener('click', function () {
      var direction = control.getAttribute('data-look');
      if (direction === 'left') views[active].x = wrap(views[active].x - 8);
      if (direction === 'right') views[active].x = wrap(views[active].x + 8);
      if (direction === 'up') views[active].y = clamp(views[active].y - 7, 20, 80);
      if (direction === 'down') views[active].y = clamp(views[active].y + 7, 20, 80);
      if (direction === 'reset') views[active] = { x: 50, y: 50 };
      renderView(active);
    });
  });
  if (backControl) {
    backControl.addEventListener('click', function () { goTo(Math.max(0, active - 1)); });
  }

  stage.addEventListener('pointerdown', function (event) {
    if (event.target.closest('button,a')) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    var deltaX = event.clientX - startX;
    var deltaY = event.clientY - startY;
    startX = event.clientX;
    startY = event.clientY;
    views[active].x = wrap(views[active].x - deltaX * 0.055);
    views[active].y = clamp(views[active].y - deltaY * 0.055, 20, 80);
    renderView(active);
  });
  function stopDragging() { dragging = false; stage.classList.remove('is-dragging'); }
  stage.addEventListener('pointerup', stopDragging);
  stage.addEventListener('pointercancel', stopDragging);

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  scenes.forEach(function (scene, index) {
    scene.setAttribute('aria-hidden', index ? 'true' : 'false');
    renderView(index);
  });
  updateFromScroll();
}());
