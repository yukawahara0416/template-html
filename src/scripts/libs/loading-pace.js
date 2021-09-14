document.addEventListener('DOMContentLoaded', function () {
  new Main();
});

class Main {
  constructor() {
    this._init();
  }
  _init() {
    // ローディングが終了したタイミングで処理を実行できます
    Pace.on('done', this._paceDone.bind(this));
  }
  _paceDone() {
    console.log('pace-done');
  }
}
