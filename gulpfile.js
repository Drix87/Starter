'use strict';

var path = {
	build: { //Тут мы укажем куда складывать готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { //Пути откуда брать исходники
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
		fonts: 'src/fonts/**/*.*'
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	}
}


var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
  return gulp.src(path.src.style)
    .pipe(sass())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({
    	stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass', 'fileinclude'], function(){
  gulp.watch(path.watch.style, ['sass']);
  gulp.watch(path.watch.html, ['fileinclude']);
  gulp.watch(path.watch.html, browserSync.reload);
  gulp.watch(path.watch.js, browserSync.reload); 
  // Other watchers
});

gulp.task('browserSync', function() {
  browserSync.init({ 
    server: {
      baseDir: 'build/'
    },
  })
});

gulp.task('fileinclude', function(){
	gulp.src([path.src.html])
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(gulp.dest(path.build.html));
});


gulp.task('cssnano', function() {
    return gulp.src('build/css/main.css')
        .pipe(cssnano())
        .pipe(rename('css/main.min.css'))
        .pipe(gulp.dest('build/'));
});



gulp.task('js:build', function(){
	gulp.src(path.src.js)
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(gulp.dest(path.build.js));
});









