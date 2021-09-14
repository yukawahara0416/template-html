document.addEventListener('DOMContentLoaded', function () {
  new Tab('.js-tab');
});

/**
 * タブ機能
 *
 * @param {string|HTMLElement} trigger トリガーのセレクタもしくはHTMLElement
 * @var {string} eventType スマホ対応（touchstartで発火します）
 */

class Tab {
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

        // クラスを操作したいタブを準備します
        const tabs = trigger.parentNode.children;
        // クラスを操作したいコンテンツを準備します
        const target = trigger.getAttribute('data-target');
        const targetNode = document.querySelector('#' + target);
        const contents = targetNode.parentNode.children;

        // タブのクラスを操作します
        this._tabSwitch(trigger, tabs);
        // コンテンツのクラスを操作します
        this._tabSwitch(targetNode, contents);
      });
    });
  }
  // クリックしたタブをアクティブに、それ以外を非アクティブにします
  _tabSwitch(current, nodes) {
    [...nodes].forEach(node => {
      node.classList.remove('is-checked');
    });
    current.classList.add('is-checked');
  }
  _getEventType() {
    return window.ontouchstart ? 'touchstart' : 'click';
  }
}
