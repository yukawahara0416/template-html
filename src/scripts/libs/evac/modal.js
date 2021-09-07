document.addEventListener('DOMContentLoaded', () => {
  new Modal('.js-modal');
});

/**
 * モーダル機能
 *
 * @param {string|HTMLElement} trigger トリガーのセレクタもしくはHTMLElement
 * @var {string} eventType スマホ対応（touchstartで発火します）
 */

class Modal {
  constructor(trigger) {
    this.DOM = {};
    this.DOM.triggers = trigger instanceof HTMLElement ? trigger : document.querySelectorAll(trigger);
    this.eventType = this._getEventType();
    this._addEvent();
  }
  _addEvent() {
    // トリガーにイベントを仕込みます
    [...this.DOM.triggers].forEach(trigger => {
      trigger.addEventListener(this.eventType, e => {
        e.preventDefault();
        this._toggle(trigger);
      });
    });
  }
  _toggle(trigger) {
    // BEM_BLOCK要素のクラスをトグルします
    const parent = trigger.closest('.c-modal');
    parent.classList.toggle('is-active');
  }
  _getEventType() {
    return window.ontouchstart ? 'touchstart' : 'click';
  }
}
