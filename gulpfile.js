const gulp = require("gulp");
const $ = require("gulp-load-plugins")({
  pattern: [
    "gulp{-,.}*",
    "autoprefixer",
    "browser-sync",
    "css-declaration-sorter",
    "imagemin-mozjpeg",
    "purgecss-with-wordpress",
    "imagemin-pngquant",
  ],
  postRequireTransforms: {
    sass: function (sass) {
      return sass(require("sass"));
    },
  },
  rename: {
    "gulp-merge-media-queries": "mmq",
    "css-declaration-sorter": "cssdeclsort",
    "purgecss-with-wordpress": "purgecssWp",
  },
});

gulp.task("sass", function () {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.sassGlob())
    .pipe($.sass({ outputStyle: "expanded" }))
    .pipe($.postcss([$.autoprefixer()]))
    .pipe($.postcss([$.cssdeclsort({ order: "alphabetical" })]))
    .pipe($.mmq())
    .pipe($.stylelint({ fix: true, failAfterError: false }))
    .pipe(
      $.purgecss({
        content: ["dist/*.html", "dist/**/*.js"],
        whitelist: $.purgecssWp.whitelist,
        whitelistPatterns: $.purgecssWp.whitelistPatterns,
      })
    )
    .pipe($.cleanCss())
    .pipe($.rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/styles"));
});

gulp.task("js", function () {
  return gulp
    .src(["src/scripts/**/*.js", "!src/scripts/**/evac/*.js", "!src/scripts/**/*.min.js"])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.uglify())
    .pipe($.rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/scripts"));
});

gulp.task("js-min", function () {
  return gulp
    .src(["src/scripts/**/*.min.js", "!src/scripts/**/evac/*.js"])
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp jsでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe(gulp.dest("dist/scripts"));
});

gulp.task("html", function () {
  return gulp
    .src("src/index.html")
    .pipe($.plumber({ errorHandler: $.notify.onError({ title: "gulp sassでエラーが発生しました", message: "<%= error.message %>" }) }))
    .pipe($.replace(/.css"/g, '.min.css"'))
    .pipe($.replace(/.js"/g, '.min.js"'))
    .pipe($.replace(/.min.min./g, ".min."))
    .pipe(gulp.dest("dist"));
});

const imageminOption = [
  $.imageminPngquant({ quality: [0.65, 0.8] }),
  $.imageminMozjpeg({ quality: 85 }),
  $.imagemin.gifsicle({ interlaced: false, optimizationLevel: 1, colors: 256 }),
  $.imagemin.mozjpeg(),
  $.imagemin.optipng(),
  $.imagemin.svgo(),
];

gulp.task("image", function () {
  return gulp.src("src/images/*.{png,jpg,gif,svg}").pipe($.imagemin(imageminOption)).pipe(gulp.dest("dist/images"));
});

/**
 * HTMLベースで開発する場合
 */

gulp.task("browser-sync", function () {
  return $.browserSync({
    server: { baseDir: "./" },
    startPath: "src/index.html",
    files: ["src/scripts/**", "src/styles/**", "src/images/**", "src/index.html"],
    open: "external",
  });
});

gulp.task("init", gulp.series("html", "js", "js-min", "sass", "image"));

gulp.task("default", gulp.series("init", "browser-sync"), function () {
  gulp.watch("src/index.html", gulp.series("html"));
  gulp.watch("src/scripts/**/*.js", gulp.series("js", "js-min"));
  gulp.watch("src/styles/**/*.scss", gulp.series("sass"));
  gulp.watch("src/images/**/*.{png,jpg,gif,svg}", gulp.series("image"));
});

/**
 * WordPressで開発する場合
 */

// gulp.task('browser-sync-wp', function () {
//   return $.browserSync({
//     files: ['src/scripts/**', 'src/styles/**', 'src/images/**', './**/*.php'],
//     proxy: 'test.local', // Local by Flywheel にある「Site Domain」に合わせる
//     open: 'external',
//   });
// });

// gulp.task('init', gulp.series('js', 'js-min', 'sass', 'image'));

// gulp.task('default', gulp.series('init', 'browser-sync-wp'), function () {
//   gulp.watch('src/scripts/**/*.js', gulp.series('js', 'js-min'));
//   gulp.watch('src/styles/**/*.scss', gulp.series('sass'));
//   gulp.watch('src/images/**/*.{png,jpg,gif,svg}', gulp.series('image'));
// });
