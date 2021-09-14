document.addEventListener('DOMContentLoaded', function () {
  new AnimationFrame('.js-anim-frame', zoomAnimation);
});

function zoomAnimation(el) {
  el.style.width = 100 + scrollY / 10 + '%';
}

/**
 * RequestAnimationFrameのシンタックスシュガー
 *
 * @param {string} el アニメーションさせたい要素のセレクタ
 * @param {function} cb コールバック関数
 */

class AnimationFrame {
  constructor(el, cb) {
    this.DOM = {};
    this.DOM.els = document.querySelectorAll(el);
    this.cb = cb;
    this._addEvent();
  }
  _addEvent() {
    document.addEventListener('scroll', this._loop.bind(this), {
      // スクロールイベント内でpreventDefault()がされてない事をブラウザに教える
      passive: true,
    });
  }
  _loop() {
    [...this.DOM.els].forEach(el => {
      this.cb(el);
    });
    requestAnimationFrame(this._loop.bind(this));
  }
}
