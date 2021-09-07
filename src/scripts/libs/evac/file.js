document.addEventListener('DOMContentLoaded', function () {
  new InputFile('.js-file');
});

/**
 * ファイル選択機能
 *
 * @param {string|HTMLElement} input ファイル選択ボタンのセレクタもしくはHTMLElement
 */

class InputFile {
  constructor(input) {
    this.DOM = {};
    this.DOM.inputs = input instanceof HTMLElement ? input : document.querySelectorAll(input);
    this._addEvent();
  }
  _addEvent() {
    // ボタンにイベントを仕込みます
    [...this.DOM.inputs].forEach(input => {
      // chageイベント
      input.addEventListener('change', () => {
        // c-file__result要素を取得してテキスト・CSSを操作します
        const parent = input.parentNode;
        const result = parent.querySelector('.c-file__result');
        result.style.display = 'inline';
        result.innerText = input.value;
      });
    });
  }
}
