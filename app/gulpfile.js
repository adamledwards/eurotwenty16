'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp.src('./static/sass/screen.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./static/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
gulp.task('watch', ['sass:watch']);
