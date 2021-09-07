document.addEventListener('DOMContentLoaded', function () {
  new Parallax('.js-parallax');
});

/**
 * 画面に表示されるとアニメーション
 *
 * @param {string} target アニメーションしたい要素のセレクタ
 */

class Parallax {
  constructor(target) {
    this.target = target;
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
    this._scrollInit();
  }

  _inviewAnimation(el, inview) {
    if (inview) {
      el.classList.add('inview');
    } else {
      el.classList.remove('inview');
    }
  }
  _scrollInit() {
    this.observers = new ScrollObserver(this.target, this._inviewAnimation);
  }
}
