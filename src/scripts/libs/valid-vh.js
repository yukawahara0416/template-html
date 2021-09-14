document.addEventListener('DOMContentLoaded', function () {
  new ValidVh();
});

class ValidVh {
  constructor() {
    this._init();
  }
  _init() {
    window.addEventListener('resize', this.setHeight);
  }
  setHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
