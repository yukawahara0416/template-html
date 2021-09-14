document.addEventListener('DOMContentLoaded', function () {
  new Floating('.js-floating');
});

/**
 * フロート機能（ページトップスクロール機能）
 *
 * @param {string|HTMLElement} float フロートボタンのセレクタもしくはHTMLElement
 * @param {integer} scroll フロートボタンが表示されるまでのスクロール量
 * @param {integer} adjust フロート時の終着位置（ページ最上部からの距離）
 * @var {string} eventType スマホ対応（touchstartで発火します）
 */

class Floating {
  constructor(float, scroll = 0, adjust = 0) {
    this.DOM = {};
    this.DOM.body = document.querySelector('body');
    this.DOM.float = float instanceof HTMLElement ? float : document.querySelector(float);
    this.DOM.trigger = document.createElement('div');
    this.scroll = scroll;
    this.adjust = adjust;
    this.eventType = this._getEventType();
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
    // フロート要素にイベントを仕込みます
    this._addEventFloat();
  }
  _triggerInit() {
    this.DOM.trigger.classList.add('js-floating-trigger');
    this.DOM.trigger.style.height = this.scroll + 'px';
    this.DOM.trigger.style.position = 'absolute';
    this.DOM.body.insertBefore(this.DOM.trigger, this.DOM.body.firstChild);
  }
  _scrollInit() {
    this.observers = new ScrollObserver(this.DOM.trigger, this._floatingAnimation.bind(this), { once: false });
  }
  _addEventFloat() {
    this.DOM.float.addEventListener(this.eventType, this._floating.bind(this));
  }

  // bodyの属性を操作して、トリガーの表示を切り替えます
  _floatingAnimation(el, inview) {
    if (inview) {
      this.DOM.body.setAttribute('data-floating', 'false');
    } else {
      this.DOM.body.setAttribute('data-floating', 'true');
    }
  }
  // フロートします
  _floating() {
    scrollTo({ top: this.adjust, behavior: 'smooth' });
  }
  _getEventType() {
    return window.ontouchstart ? 'touchstart' : 'click';
  }
}
