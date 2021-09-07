document.addEventListener('DOMContentLoaded', () => {
  new Accordion('.js-accordion', true);
});

/**
 * アコーディオンを実装します。
 *
 * 使用例：
 * new Accordion('.js-accordion', true);
 *
 * @param {string} trigger トリガーのセレクタ
 * @param {boolean} single trueにすると１つ開いたら他は閉じるようになります
 * @var {string} eventType スマホ対応（touchstartで発火します）
 */

class Accordion {
  constructor(trigger, single = false) {
    this.DOM = {};
    this.DOM.triggers = document.querySelectorAll(trigger);
    this.single = single;
    this.eventType = this._getEventType();
    this._addEvent();
  }
  _addEvent() {
    // トリガーにイベントを仕込みます
    [...this.DOM.triggers].forEach(trigger => {
      if (this.single) {
        // １つ開いても他は閉じない
        trigger.addEventListener(this.eventType, this._single.bind(this, trigger));
      } else {
        // １つ開いたら他は閉じる
        trigger.addEventListener(this.eventType, this._toggle.bind(this, trigger));
      }
    });
  }
  _toggle(trigger) {
    // 親要素のクラスをトグルしているだけです
    const parent = trigger.parentNode;
    parent.classList.toggle('is-active');
  }
  _close(trigger) {
    // 親要素のクラスをリムーブしているだけです
    const parent = trigger.parentNode;
    parent.classList.remove('is-active');
  }
  _single(thisTrigger) {
    // クリックしたトリガーにはtoggleイベントを発火させます
    // クリックしたトリガー以外にはcloseイベントを発火させます
    [...this.DOM.triggers].forEach(trigger => {
      if (trigger === thisTrigger) {
        this._toggle(thisTrigger);
        return;
      }

      this._close(trigger);
    });
  }
  _getEventType() {
    return window.ontouchstart ? 'touchstart' : 'click';
  }
}
