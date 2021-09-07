document.addEventListener('DOMContentLoaded', function () {
  new HeroSlider('.js-hero-container');
});

/**
 * 生成したSwiperにIntersectionObserverを連携させます。
 * Swiperが画面内にあるときだけスライドさせることでリソースを節約します。
 *
 * @param {string} container スライダーコンテナ要素のセレクタ
 * @param {object} options Swiperのオプション
 */

class HeroSlider {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
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
    // Swiper生成
    this.hero = new CustomSwiper(this.container, this.options);
    // Swiperが画面内にあるときだけスライドさせる
    this._scrollInit();
  }
  _scrollInit() {
    this.observers = new ScrollObserver(this.container, this._toggleSlideAnimation.bind(this), { once: false });
  }
  // Swiperが画面内にあるときだけスライドさせる
  _toggleSlideAnimation(el, inview) {
    if (inview) {
      this.hero.start();
    } else {
      this.hero.stop();
    }
  }
}

/**
 * Swiper.jsのシュガーシンタックス
 *
 * @param {string} container スライダーコンテナ要素のセレクタ
 * @param {object} options Swiperのオプション
 */

class CustomSwiper {
  constructor(container, options = {}) {
    this.container = container;

    const defaultOptions = {
      // Optional parameters
      // direction: 'vertical',
      loop: true,
      grabCursor: true,
      mousewheel: true,
      effect: 'slide',
      centeredSlides: true,
      slidesPerView: 1,
      // speed: 1000,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // breakpoints: {
      //   1024: {
      //     slidesPerView: 2,
      //   },
      // },
    };

    this.options = Object.assign(defaultOptions, options);
    this.swiper = this._initSwiper();
  }
  _initSwiper() {
    return new Swiper(this.container, this.options);
  }
  start(options = {}) {
    options = Object.assign({ delay: 4000, disableOnInteraction: false }, options);
    this.swiper.params.autoplay = options;
    this.swiper.autoplay.start();
  }
  stop() {
    this.swiper.autoplay.stop();
  }
}
