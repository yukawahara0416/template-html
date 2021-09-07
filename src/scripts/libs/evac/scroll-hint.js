document.addEventListener('DOMContentLoaded', function () {
  new ScrollHint('.js-scrollable', {
    i18n: {
      scrollable: 'スクロールできます',
    },
    suggestiveShadow: true,
    // scrollHintIconAppendClass: 'scroll-hint-icon-white',
  });
});
