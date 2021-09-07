/**
 * IntersectionObserverのシュガーシンタックス（Polyfill対応済）
 *
 * @param {string|HTMLElement|NodeList} els 監視対象の要素のクラス名またはHTMLElementまたはNodeList
 * @param {function} cb 監視対象がinviewになった際に発火する処理
 * @param {object} options IntersectionObserverのオプション
 */

class ScrollObserver {
  constructor(els, cb, options) {
    this.DOM = {};
    this.DOM.els = els instanceof HTMLElement ? els : document.querySelectorAll(els);

    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
      once: true,
    };

    this.cb = cb;
    this.options = Object.assign(defaultOptions, options);
    this.once = this.options.once;
    this._init();
  }
  _init() {
    const callback = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.cb(entry.target, true);
          if (this.once) {
            observer.unobserve(entry.target);
          }
        } else {
          this.cb(entry.target, false);
        }
      });
    };

    this.io = new IntersectionObserver(callback.bind(this), this.options);

    // @see https://github.com/w3c/IntersectionObserver/tree/master/polyfill
    this.io.POLL_INTERVAL = 100;

    // NodeListの場合はforEach処理します
    if (this.DOM.els instanceof HTMLElement) this.io.observe(this.DOM.els);
    if (this.DOM.els instanceof NodeList) [...this.DOM.els].forEach(el => this.io.observe(el));
  }

  destroy() {
    this.io.disconnect();
  }
}
