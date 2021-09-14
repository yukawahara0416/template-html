document.addEventListener('DOMContentLoaded', function () {
  new SmoothScroll(100);
});

/**
 * スムーススクロール機能
 *
 * @param {integer} gap スクロール停止位置を微調整できます。
 * @param {string} exclude スムーススクロールさせたくない要素のセレクタ
 * @var {string} eventType スマホ対応（touchstartで発火します）
 */

class SmoothScroll {
  constructor(gap = 60, exclude = '.js-scroll-excluded') {
    this.DOM = {};
    this.DOM.triggers = document.querySelectorAll('a[href^="#"]');
    this.gap = gap;
    this.exclude = exclude;
    this.eventType = this._getEventType();
    this._addEvent();
  }
  _addEvent() {
    // トリガーにイベントを仕込みます
    [...this.DOM.triggers].forEach(trigger => {
      // スムーススクロール除外の場合は処理を中断します
      if (this._isExcluded(trigger)) return;

      // ページ内リンクが存在しない場合は処理を中断します
      const targetHref = trigger.getAttribute('href');
      const targetNode = document.getElementById(targetHref.replace('#', ''));
      if (this._notExist(targetNode)) return;

      // スクロール位置を算出します;
      const targetY = this._getPosition(targetNode);

      // イベントを追加します
      trigger.addEventListener(this.eventType, e => {
        e.preventDefault();
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    });
  }
  _isExcluded(el) {
    return el.classList.contains(this.exclude.replace('.', ''));
  }
  _notExist(el) {
    return el === null;
  }
  _getPosition(targetNode) {
    const rect = targetNode.getBoundingClientRect().top;
    const offset = window.pageYOffset;
    return rect + offset - this.gap;
  }
  _getEventType() {
    return window.ontouchstart ? 'touchstart' : 'click';
  }
}
