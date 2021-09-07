const gulp = require("gulp");
const $ = require("gulp-load-plugins")({
  pattern: [
    // 名前のあたまに「gulp」がつくプラグインをまとめてrequire
    "gulp{-,.}*",
    // そのほかのプラグイン
    "autoprefixer",
    "browser-sync",
    "css-declaration-sorter",
    "imagemin-mozjpeg",
    "purgecss-with-wordpress",
    "imagemin-pngquant",
  ],
  // gulp-sassにSassコンパイラをセットしています
  postRequireTransforms: {
    sass: function (sass) {
      return sass(require("sass"));
    },
  },
  // 名前が長いプラグインを短縮しています
  rename: {
    "gulp-merge-media-queries": "mmq",
    "css-declaration-sorter": "cssdeclsort",
    "purgecss-with-wordpress": "purgecssWp",
  },
});

/**
 * Sass関連
 */

gulp.task("sass", function (done) {
  gulp
    .src("src/styles/**/*.scss")
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.sassGlob())
    .pipe($.sass({ outputStyle: "expanded" }))
    .pipe($.postcss([$.autoprefixer()]))
    .pipe($.postcss([$.cssdeclsort({ order: "alphabetical" })]))
    .pipe($.mmq())
    .pipe($.stylelint({ fix: true, failAfterError: false }))

    // HTMLベースのみ使用可能です
    // 未使用のクラスをCSSから削除します
    // .pipe(
    //   $.purgecss({
    //     content: ['dist/*.html', 'dist/**/*.js'],
    //     whitelist: $.purgecssWp.whitelist,
    //     whitelistPatterns: $.purgecssWp.whitelistPatterns
    //   })
    // )
    // コードをminify
    .pipe($.cleanCss())
    // ファイル名にminを付与します
    .pipe($.rename({ suffix: ".min" }))
    // 本番用フォルダに保存します
    .pipe(gulp.dest("dist/styles"));
  done();
});

/**
 * JS関連
 */

gulp.task("js", function (done) {
  gulp
    // minifyファイルはtask「js-min」で別途処理しています
    .src(["src/scripts/**/*.js", "!src/scripts/**/evac/*.js", "!src/scripts/**/*.min.js"])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    // minify
    // .pipe($.uglify())
    // ファイル名にminを付与します
    // .pipe($.rename({ suffix: '.min' }))
    // 本番用フォルダに保存します
    .pipe(gulp.dest("dist/scripts"));
  done();
});

/**
 * JS関連（minify）
 */

gulp.task("js-min", function (done) {
  gulp
    // すでにminifyされているファイルを処理しています
    .src(["src/scripts/**/*.min.js", "!src/scripts/**/evac/*.js"])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    // そのまま本番用フォルダに保存します
    .pipe(gulp.dest("dist/scripts"));
  done();
});

/**
 * HTML関連
 */

gulp.task("html", function (done) {
  gulp
    .src("src/index.html")
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    // ファイル名をminifyに変更しています
    .pipe($.replace(/.css"/g, '.min.css"'))
    .pipe($.replace(/.js"/g, '.min.js"'))
    .pipe($.replace(/.min.min./g, ".min."))
    // 本番用フォルダに保存します
    .pipe(gulp.dest("dist"));
  done();
});

/**
 * 画像関連
 */

// オプション
const options = [
  $.imageminPngquant({ quality: [0.65, 0.8] }),
  $.imageminMozjpeg({ quality: 85 }),
  $.imagemin.gifsicle({ interlaced: false, optimizationLevel: 1, colors: 256 }),
  $.imagemin.mozjpeg(),
  $.imagemin.optipng(),
  $.imagemin.svgo(),
];

gulp.task("image", function (done) {
  gulp
    .src("src/images/*.{png,jpg,gif,svg}")
    // 画像を圧縮します
    .pipe($.imagemin(options))
    // 本番用フォルダに保存します
    .pipe(gulp.dest("dist/images"));
  done();
});

/**
 * distフォルダ（本番用フォルダ）に保存
 */

// HTMLベースバージョン
gulp.task("init", gulp.series("sass", "js", "js-min", "image", "html"));

// WordPressバージョン（HTMLは処理しません）
gulp.task("init-wp", gulp.series("sass", "js", "js-min", "image"));

/**
 * ブラウザー同期機能
 */

// サーバーの起動（HTMLベースバージョン）
gulp.task("browser-sync", function (done) {
  $.browserSync({
    server: { baseDir: "./" },
    startPath: "src/index.html",
    files: ["src/scripts/**", "src/styles/**", "src/images/**", "src/index.html"],
    open: "external",
  });
  done();
});

// サーバーの起動（WordPressバージョン）
gulp.task("browser-sync-wp", function (done) {
  $.browserSync({
    files: ["src/scripts/**", "src/styles/**", "src/images/**", "./**/*.php"],
    proxy: "dip-blog.local", // Local by Flywheel にある「Site Domain」に合わせる
    open: "external",
  });
  done();
});

// サーバーのリロード
gulp.task("bs-reload", function (done) {
  $.browserSync.reload();
  done();
});

/**
 * ファイル更新を監視
 * 本番用フォルダに更新を反映し、サーバーをリロード
 */

// HTMLベースバージョン
gulp.task("watch", function () {
  gulp.watch("src/styles/**/*.scss", gulp.series("sass", "bs-reload"));
  gulp.watch("src/scripts/**/*.js", gulp.series("js", "js-min", "bs-reload"));
  gulp.watch("src/images/**/*.{png,jpg,gif,svg}", gulp.series("image", "bs-reload"));
  gulp.watch("src/**/*.html", gulp.series("html", "bs-reload"));
});

// WordPressバージョン
gulp.task("watch-wp", function () {
  gulp.watch("src/styles/**/*.scss", gulp.series("sass", "bs-reload"));
  gulp.watch("src/scripts/**/*.js", gulp.series("js", "js-min", "bs-reload"));
  gulp.watch("src/images/**/*.{png,jpg,gif,svg}", gulp.series("image", "bs-reload"));
});

/**
 * デフォルト処理
 * 使用方法： $ gulp
 */

// HTMLベースバージョン
gulp.task("default", gulp.series(gulp.parallel("init", "browser-sync", "watch")));

// WordPressバージョン
// gulp.task("default", gulp.series(gulp.parallel("init-wp", "browser-sync-wp", "watch-wp")));
