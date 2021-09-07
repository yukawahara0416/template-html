document.addEventListener('DOMContentLoaded', function () {
  /**
   * 画像のサイズ調整プロパティ「object-fit」をIEやEdgeに対応させます
   *
   * 使用例：
   * <img class="js-object-fit" src="test.jpg">
   */

  objectFitImages('img.js-object-fit');
});
