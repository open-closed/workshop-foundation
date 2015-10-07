var gulp        = require('gulp');
var sass        = require('gulp-sass');
var jade        = require('gulp-jade');
var uglify      = require('gulp-uglify');
var inlineCss   = require('gulp-inline-css');
var clean       = require('gulp-clean');
var browserSync = require('browser-sync');

var PATH_DEST      = "dist/";
var PATH_CSS       = "css/";
var PATH_SCSS      = "scss/";
var PATH_JADE_SRC  = "jade/";

gulp.task('clean', function() {
  return gulp.src('./'+PATH_DEST, {read: false})
  .pipe(clean());
});

gulp.task('sass', function() {
  return gulp.src(PATH_SCSS+'*.scss')
  .pipe(sass())
  .pipe(gulp.dest("./"+PATH_DEST+PATH_CSS));
});

gulp.task('compile-jade', function() {
  return gulp.src(PATH_JADE_SRC+'*.jade')
  .pipe(jade({
    pretty: false
  }))
  .pipe(gulp.dest('./'+PATH_DEST))
});

gulp.task('statics', function() {
  gulp.src("favicon.ico")
  .pipe(gulp.dest("./"+PATH_DEST));
});

gulp.task('bundle', ['sass', 'compile-jade', 'statics'], function() {
  return  gulp.src('./'+PATH_DEST+'*.html')
  .pipe(inlineCss())
  .pipe(gulp.dest(PATH_DEST))
});

gulp.task('serve', ['bundle'], function() {
  browserSync({
    online: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['./'+PATH_DEST],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  });
});

gulp.task('bundle-sync', ['bundle'], browserSync.reload);

gulp.task('watch', ['serve'], function() {
  gulp.watch(['./'+PATH_JADE_SRC+'*.jade', './'+PATH_SCSS+'*.scss'], ['bundle-sync']);
});

gulp.task('default', ['bundle'], function() {});
