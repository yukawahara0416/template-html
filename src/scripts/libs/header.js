document.addEventListener('DOMContentLoaded', function () {
  new Header(100);
});

/**
 * ヘッダー固定機能
 *
 * @param {integer} scroll ヘッダーが固定されるまでのスクロール量
 */

class Header {
  constructor(scroll) {
    this.DOM = {};
    this.DOM.body = document.querySelector('body');
    this.DOM.trigger = document.createElement('div');
    this.scroll = scroll;
    this._observers = [];
    this._init();
  }

  // getter/setter
  set observers(val) {
    this._observers.push(val);
  }
  get observers() {
    return this._observers;
  }

  _init() {
    // トリガー要素をbody直下に設置します
    this._triggerInit();
    // トリガー要素を監視するIntersectionObserverを設置します
    this._scrollInit();
  }
  _triggerInit() {
    this.DOM.trigger.classList.add('js-header-trigger');
    this.DOM.trigger.style.height = this.scroll + 'px';
    this.DOM.trigger.style.position = 'absolute';

    this.DOM.body.insertBefore(this.DOM.trigger, this.DOM.body.firstChild);
  }
  _scrollInit() {
    this.observers = new ScrollObserver(this.DOM.trigger, this._headingAnimation.bind(this), { once: false });
  }
  _headingAnimation(el, inview) {
    if (inview) {
      this.DOM.body.setAttribute('data-header', 'false');
    } else {
      this.DOM.body.setAttribute('data-header', 'true');
    }
  }
}
