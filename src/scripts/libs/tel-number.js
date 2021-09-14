document.addEventListener('DOMContentLoaded', function () {
  const ua = navigator.userAgent;

  if (ua.indexOf('iPhone') < 0 && ua.indexOf('Android') < 0) {
    const targets = document.querySelectorAll('a[href^="tel:"]');

    [...targets].forEach(target => {
      target.style.cursor = 'default';
      target.addEventListener('click', e => {
        e.preventDefault();
      });
    });
  }
});
