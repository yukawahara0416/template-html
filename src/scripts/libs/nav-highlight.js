document.addEventListener('DOMContentLoaded', () => {
  new NavHighlight('.js-nav-highlight');
});

/**
 * 画面に表示されている要素に対応するナビゲーションメニューをハイライトします。
 *
 * @param {string} content 監視する要素のセレクタ（コンテンツ側の要素に付与します）
 * @param {string} activate ハイライトを定義しているクラス名（ナビゲーション側の要素に付与されます）
 */

class NavHighlight {
  constructor(content, activate = 'c-navigation__current-show') {
    this.content = content;
    this.activate = activate;
    this._init();
  }
  _init() {
    // IntersectionObserverのシュガーシンタックス
    new ScrollObserver(this.content, cb.bind(this), { once: false });

    // ナビゲーション要素を取得してクラス制御することでアニメーションさせます
    function cb(content, inview) {
      // 監視する要素のid属性を取得
      const id = content.getAttribute('id');
      // id属性値に対応するナビゲーション要素を取得
      const navMenu = document.querySelector(`a[href="#${id}"]`).parentElement;
      // ナビゲーション要素のクラスを制御してアニメーションさせます
      if (inview) {
        navMenu.classList.add(this.activate);
      } else {
        navMenu.classList.remove(this.activate);
      }
    }
  }
}
