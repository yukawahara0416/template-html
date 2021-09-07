/**
 * jQueryのSlideUp/SlideDown/SlideToggleに相当します。
 *
 * @param {string|HTMLElement} el アニメーションさせる要素のセレクタもしくはHTMLElement
 * @param {integer} duration アニメーションする時間（ミリ秒）
 */

function slideUp(el, duration = 300) {
  const node = el instanceof HTMLElement ? le : document.querySelector(el);

  node.style.height = node.offsetHeight + 'px';
  node.offsetHeight;
  node.style.transitionProperty = 'height, margin, padding';
  node.style.transitionDuration = duration + 'ms';
  node.style.transitionTimingFunction = 'ease';
  node.style.overflow = 'hidden';
  node.style.height = 0;
  node.style.paddingTop = 0;
  node.style.paddingBottom = 0;
  node.style.marginTop = 0;
  node.style.marginBottom = 0;
  setTimeout(() => {
    node.style.display = 'none';
    node.style.removeProperty('height');
    node.style.removeProperty('padding-top');
    node.style.removeProperty('padding-bottom');
    node.style.removeProperty('margin-top');
    node.style.removeProperty('margin-bottom');
    node.style.removeProperty('overflow');
    node.style.removeProperty('transition-duration');
    node.style.removeProperty('transition-property');
    node.style.removeProperty('transition-timing-function');
  }, duration);
}

function slideDown(el, duration = 300) {
  const node = el instanceof HTMLElement ? le : document.querySelector(el);

  node.style.removeProperty('display');
  let display = window.getComputedStyle(el).display;
  if (display === 'none') display = 'block';
  node.style.display = display;
  let height = node.offsetHeight;
  node.style.overflow = 'hidden';
  node.style.height = 0;
  node.style.paddingTop = 0;
  node.style.paddingBottom = 0;
  node.style.marginTop = 0;
  node.style.marginBottom = 0;
  node.offsetHeight;
  node.style.transitionProperty = 'height, margin, padding';
  node.style.transitionDuration = duration + 'ms';
  node.style.transitionTimingFunction = 'ease';
  node.style.height = height + 'px';
  node.style.removeProperty('padding-top');
  node.style.removeProperty('padding-bottom');
  node.style.removeProperty('margin-top');
  node.style.removeProperty('margin-bottom');
  setTimeout(() => {
    node.style.removeProperty('height');
    node.style.removeProperty('overflow');
    node.style.removeProperty('transition-duration');
    node.style.removeProperty('transition-property');
    node.style.removeProperty('transition-timing-function');
  }, duration);
}

function slideToggle(el, duration = 300) {
  const node = el instanceof HTMLElement ? el : document.querySelector(el);

  if (window.getComputedStyle(el).display === 'none') {
    slideDown(el, duration);
  } else {
    slideUp(el, duration);
  }
}
