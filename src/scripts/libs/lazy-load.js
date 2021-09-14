document.addEventListener('DOMContentLoaded', function () {
  const ll = new LazyLoad('.lazyload');

  // 動的にDOMを追加した場合、再度observe()で呼び出します。

  // 動的にDOMを追加するテスト
  // const el = document.getElementById('images');
  // let div = document.createElement('img');
  // div.src = '';
  // div.dataset.src = 'image_4.jpg';
  // div.class = 'lazyload';
  // el.appendChild(div);

  // 再度呼び出し
  // ll.observe();
});

/**
 * lazyload機能
 *
 * ライブラリ「lozad.js」を使用しています。jQuery不要です。
 * IntersectionObserverを使用しています。lozad.jsがpolyfill対応済みです。
 *
 * 使用例：new LazyLoad('.lazyload');
 *
 * <img class="lazyload" src="" data-src="画像URL" alt="">
 * <div class="lazyload" data-background-image="画像URL"></div>
 *
 * ■imgタグで使用する場合
 * ・タグに任意のクラスを付与してください。
 * ・data-src属性に画像URLを入力します。
 * ・src属性でデフォルト画像を設定することも可能ですが、空でも動作します。
 *
 * ■divタグで使用する場合
 * ・タグに任意のクラスを付与してください。
 * ・data-background-image属性に画像URLを入力します。
 */

class LazyLoad {
  constructor(el, options) {
    this.el = el;
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
      once: true,
    };
    this.options = Object.assign(defaultOptions, options);
    this._init();
  }
  _init() {
    this.ll = lozad(this.el);
    // @see https://github.com/w3c/IntersectionObserver/tree/master/polyfill
    this.ll.POLL_INTERVAL = 100;
    this.ll.observe();
  }
  observe() {
    this.ll.observe();
  }
}
