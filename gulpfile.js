// srcディレクトリまでのパスを指定できます
const path = "";
// プロキシを指定できます（Local by Flywheel にある「Site Domain」に合わせる）
const proxy = "dip-code.local";

const gulp = require("gulp");
const $ = require("gulp-load-plugins")({
  pattern: [
    "gulp{-,.}*", // 名前のあたまに「gulp」がつくプラグインをまとめてrequire
    "autoprefixer",
    "browser-sync",
    "css-declaration-sorter",
    "imagemin-mozjpeg",
    "purgecss-with-wordpress",
    "imagemin-pngquant",
  ],
  // gulp-sassにSassコンパイラをセット
  postRequireTransforms: {
    sass: function (sass) {
      return sass(require("sass"));
    },
  },
  // 名前が長いプラグインを短縮
  rename: {
    "gulp-merge-media-queries": "mmq",
    "css-declaration-sorter": "cssdeclsort",
    "purgecss-with-wordpress": "purgecssWp",
  },
});

/**
 * Sass関連
 */

gulp.task("sass-src", function (done) {
  gulp
    .src(`${path}src/styles/**/*.scss`)
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe(
      $.sassGlob({
        ignorePaths: ["**/evac/**/*.scss"],
      })
    )
    .pipe($.sass({ outputStyle: "expanded" }))
    .pipe($.postcss([$.autoprefixer()]))
    .pipe($.postcss([$.cssdeclsort({ order: "alphabetical" })]))
    .pipe($.mmq())
    .pipe($.stylelint({ fix: true, failAfterError: false }))

    // HTMLベースのみ使用可能です
    // 未使用のクラスをCSSから削除します
    // .pipe(
    //   $.purgecss({
    //     content: [`${path}dist/*.html`, `${path}dist/**/*.js`],
    //     whitelist: $.purgecssWp.whitelist,
    //     whitelistPatterns: $.purgecssWp.whitelistPatterns
    //   })
    // )

    // 開発用のファイル生成
    .pipe(gulp.dest(`${path}src/styles`));
  done();
});

gulp.task("sass-dist", function (done) {
  gulp
    .src(`${path}src/styles/**/*.scss`)
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe(
      $.sassGlob({
        ignorePaths: ["**/evac/**/*.scss"],
      })
    )
    .pipe($.sass({ outputStyle: "expanded" }))
    .pipe($.postcss([$.autoprefixer()]))
    .pipe($.postcss([$.cssdeclsort({ order: "alphabetical" })]))
    .pipe($.mmq())
    .pipe($.stylelint({ fix: true, failAfterError: false }))

    // HTMLベースのみ使用可能です
    // 未使用のクラスをCSSから削除します
    // .pipe(
    //   $.purgecss({
    //     content: [`${path}dist/*.html`, `${path}dist/**/*.js`],
    //     whitelist: $.purgecssWp.whitelist,
    //     whitelistPatterns: $.purgecssWp.whitelistPatterns
    //   })
    // )

    // 開発用のファイル生成
    .pipe(gulp.dest(`${path}src/styles`))

    // 本番用のファイル生成
    .pipe($.cleanCss())
    .pipe($.rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${path}dist/styles`));
  done();
});

/**
 * JS関連
 */

gulp.task("js", function (done) {
  // 未圧縮のファイルを圧縮
  gulp
    .src([`${path}src/scripts/**/*.js`, `!${path}src/scripts/**/evac/*.js`, `!${path}src/scripts/**/*.min.js`])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.uglify())
    .pipe($.rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${path}dist/scripts`));

  // 圧縮済みのファイルはそのまま利用
  gulp
    .src([`${path}src/scripts/**/*.min.js`, `!${path}src/scripts/**/evac/*.js`])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe(gulp.dest(`${path}dist/scripts`));

  done();
});

/**
 * 画像関連
 */

gulp.task("image", function (done) {
  gulp
    .src(`${path}src/images/*.{png,jpg,gif,svg}`)
    .pipe(
      $.imagemin([
        $.imageminPngquant({ quality: [0.65, 0.8] }),
        $.imageminMozjpeg({ quality: 85 }),
        $.imagemin.gifsicle({ interlaced: false, optimizationLevel: 1, colors: 256 }),
        $.imagemin.mozjpeg(),
        $.imagemin.optipng(),
        $.imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest(`${path}dist/images`));
  done();
});

/**
 * HTML関連
 */

gulp.task("html", function (done) {
  gulp
    .src(`${path}src/index.html`)
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.replace(/.css"/g, '.min.css"'))
    .pipe($.replace(/.js"/g, '.min.js"'))
    .pipe($.replace(/.min.min./g, ".min."))
    .pipe(gulp.dest(`${path}dist`));
  done();
});

/**
 * ブラウザー同期機能
 */

// HTMLベースバージョン
gulp.task("browser-sync-html", function (done) {
  $.browserSync({
    server: { baseDir: "./" },
    startPath: `${path}src/index.html`,
    files: [`${path}src/scripts/**`, `${path}src/styles/**`, `${path}src/images/**`, `${path}src/index.html`],
    open: "external",
  });
  done();
});

// WordPressバージョン
gulp.task("browser-sync-wp", function (done) {
  $.browserSync({
    files: [`${path}src/scripts/**`, `${path}src/styles/**`, `${path}src/images/**`, `${path}**/*.php`],
    proxy: proxy,
    open: "external",
  });
  done();
});

/**
 * ファイル更新を監視
 */

gulp.task("watch", function () {
  gulp.watch(`${path}src/styles/**/*.scss`, gulp.series("sass-src"));
  gulp.watch(`${path}src/scripts/**/*.js`, gulp.series("js"));
  gulp.watch(`${path}src/images/**/*.{png,jpg,gif,svg}`, gulp.series("image"));
  gulp.watch(`${path}src/**/*.html`, gulp.series("html"));
});

/**
 * 本番ファイル生成
 */

gulp.task("dist-html", gulp.series(gulp.parallel("sass-dist", "js", "image", "html")));
gulp.task("dist-wp", gulp.series(gulp.parallel("sass-dist", "js", "image")));

/**
 * デフォルト処理（開発）
 */

// HTMLベースバージョン
gulp.task("default", gulp.series(gulp.parallel("sass-src", "browser-sync-html", "watch")));

// WordPressバージョン
// gulp.task("default", gulp.series(gulp.parallel("sass-src", "browser-sync-wp", "watch")));
