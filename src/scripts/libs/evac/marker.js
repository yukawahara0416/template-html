document.addEventListener('DOMContentLoaded', function () {
  new ScrollObserver('.js-marker', marker, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    once: true,
  });
});

function marker(el, inview) {
  if (inview) {
    el.classList.add('inview');
  } else {
    el.classList.remove('inview');
  }
}
