/**
 * jQueryのfadeIn/fadeOutに相当します。
 *
 * @param {string|HTMLElement} el アニメーションさせる要素のクラス名またはHTMLElement
 * @param {integer} duration アニメーションする時間（ミリ秒）
 */

function fadeIn(el, duration = 300) {
  // elがクラス名でもHTMLElementでも対応します
  const node = el instanceof HTMLElement ? el : document.querySelector(el);

  // すでに表示している場合
  if (getComputedStyle(node).display !== 'none') return;

  // まだ表示していない場合
  node.style.display = 'block';
  node.style.opacity = 0;
  const start = performance.now();

  // fadeInアニメーション
  requestAnimationFrame(function tick(timestamp) {
    // イージング計算式（linear）
    const easing = (timestamp - start) / duration;
    // opacityが0.9を超えないように
    node.style.opacity = Math.min(easing, 0.9);

    // opacityが0.9より小さいとき
    if (easing < 0.9) {
      requestAnimationFrame(tick);
    } else {
      node.style.opacity = '';
    }
  });
}

function fadeOut(el, duration = 300) {
  // elがクラス名でもHTMLElementでも対応します
  const node = el instanceof HTMLElement ? el : document.querySelector(el);

  // すでに表示していない場合
  if (getComputedStyle(node).display !== 'block') return;

  // まだ表示している場合
  node.style.display = 'block';
  node.style.opacity = 0.9;
  const start = performance.now();

  requestAnimationFrame(function tick(timestamp) {
    // イージング計算式（linear）
    const easing = (timestamp - start) / duration;
    // opacityが0を下回らないように
    node.style.opacity = Math.max(0.9 - easing, 0);

    // opacityが0.9より小さいとき
    if (easing < 0.9) {
      requestAnimationFrame(tick);
    } else {
      node.style.opacity = '';
      node.style.display = 'none';
    }
  });
}
