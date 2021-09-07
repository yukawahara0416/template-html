document.addEventListener('DOMContentLoaded', function () {
  new TransitionEnd('.js-transition-end', cb, conditional);
});

/**
 * transitionが終了した際に発火する処理
 *
 * @param {HTMLElement} target 監視対象のHTMLElement
 */

function cb(target) {
  console.log('cd is called');
}

/**
 * どのtransitionが終了した際にcbを発火させるか
 *
 * @param {object} event 通知されたイベントオブジェクト
 * @param {function} cb 発火させるコールバック関数
 * @param {HTMLElement} target 監視対象のHTMLElement
 */

function conditional(event, cb, target) {
  // event.propertyName === 'transform'
  // event.pseudoElement === '::before' などを活用
  if (event.propertyName === 'transform' && event.pseudoElement === '::after') {
    cb(target);
  }
}

/**
 * Transition後にコールバックを発火させます
 * アニメーション後になにか処理を実行させたいときに重宝します^^
 *
 * @param {string|HTMLElement} target 監視要素のセレクタまたはHTMLElement
 * @param {function} cb transitionend時に実行したいコールバック関数
 * @param {function} conditional cbを発火させる条件を定義する関数
 * @param {boolean} prevent 標準のクリックイベントを無効にするか指定できます true：無効（デフォルト） false：有効
 */

class TransitionEnd {
  constructor(target, cb, conditional, prevent = true) {
    this.DOM = {};
    this.DOM.targets = target instanceof HTMLElement ? target : document.querySelectorAll(target);
    this.cb = cb;
    this.conditional = conditional;
    this.prevent = prevent;
    this._init();
  }
  _init() {
    // 標準のイベントを停止します
    if (this.prevent) this._preventDefault();
    // アニメーション後にコールバックを実行します
    this._transitionEnd(this.cb);
  }
  _preventDefault() {
    [...this.DOM.targets].forEach(target => {
      target.addEventListener('click', e => {
        e.preventDefault();
      });
    });
  }
  _transitionEnd(cb) {
    [...this.DOM.targets].forEach(target => {
      target.addEventListener('transitionend', e => {
        // transitionendは複数のイベントを吐き出すので、
        // 特定のイベントのみに限定して処理を発火させます
        // ここは処理ごとにconsole.log(e);をして良さげな条件を探してください。。。
        console.log(e.propertyName, e.pseudoElement);
        this.conditional(e, cb, target);
      });
    });
  }
}
