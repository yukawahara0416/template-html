document.addEventListener('DOMContentLoaded', function () {
  new ModalSlider('.luminous');
});

/**
 * モーダルスライダー機能（ライブラリ Luminous を使用しています）
 * 【注意】ギャラリーモードで画像遷移時にアニメーションさせることはできません
 *
 * @param {string} trigger トリガーのクラス名
 * @param {object} galleryOpts ギャラリーモードで使用する際のオプション（デフォルトでは有効）
 * @param {object} options その他オプション
 */

class ModalSlider {
  constructor(trigger, galleryOpts = {}, options = {}) {
    this.DOM = {};
    this.DOM.triggers = document.querySelectorAll(trigger);

    // デフォルトオプションを用意して上書きに備えます
    const defaultGalleryOpts = {
      arrowNavigation: true, // 矢印ナビゲーションを使用するかどうか
    };
    // デフォルトオプションを用意して上書きに備えます
    const defaultOptions = {
      namespace: null, // 拡大画像につけるクラス
      sourceAttribute: 'href', // どの属性に拡大画像のパスを指定するか
      caption: trigger => {
        return trigger.querySelector('img').getAttribute('alt'); // 表示するキャプション。関数の指定が可能
      },
      openTrigger: 'click', // どのイベントで画像を表示するか
      closeTrigger: 'click', // どのイベントで拡大画像を閉じるか
      closeWithEscape: true, // escキーでクローズさせるかどうか
      closeOnScroll: false, // スクロールしたときにクローズさせるかどうか
      appendToSelector: 'body', // 拡大画像を表示させるlightboxをどこに挿入するか
      onOpen: null, // オープン時に呼び出す関数
      onClose: null, // クローズ時に呼び出す関数
      includeImgixJSClass: false, // 拡大画像に imgix-fluid というクラスをつけるかどうか。（imgixというプラグインとの連携用？）
      injectBaseStyles: true, // ??? head内部に挿入されているstyleタグのこと？ https://github.com/imgix/luminous#theming を読めと説明されている
    };
    // オプションを上書きします
    this.galleryOpts = Object.assign(defaultGalleryOpts, galleryOpts);
    // オプションを上書きします
    this.options = Object.assign(defaultOptions, options);

    this._init();
  }
  _init() {
    // ギャラリーモードで使用する場合
    if (this.galleryOpts.arrowNavigation) {
      new LuminousGallery(this.DOM.triggers, this.galleryOpts, this.options);
      // 通常モードで使用する場合
    } else {
      [...this.DOM.triggers].forEach(trigger => {
        new Luminous(trigger, this.options);
      });
    }
  }
}
