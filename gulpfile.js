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
var minify = require('gulp-minify'); 
var imagemin = require('gulp-imagemin'); 
var runSequence = require('run-sequence'); //Плагин для последовательного запуска тасков (Задачи котороые будет в нем использоваться, обязательно должны начинаться с return gulp...)
var del = require('del'); // Для таска clean, чтобы очищать перед сборкой папку build
var autoprefixer = require('gulp-autoprefixer'); //Префиксы CSS свойств
var sourcemaps = require('gulp-sourcemaps');


gulp.task('watch', ['browserSync', 'html:build', 'style:build', 'js:build'], function(){
  gulp.watch(path.watch.html, ['html:build']);
  gulp.watch(path.watch.style, ['style:build']);
  gulp.watch(path.watch.js, ['js:build']);

  gulp.watch(path.watch.html, browserSync.reload);
  gulp.watch('build/css/main.min.css', browserSync.reload);
  gulp.watch(path.watch.js, browserSync.reload); 
});

gulp.task('browserSync', function() {
  browserSync.init({ 
    server: {
      baseDir: path.build.html
    },
  })
});

/*=======================================
=            Задачи для HTML            =
=======================================*/

gulp.task('html:build', function(){
	return gulp.src([path.src.html])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(path.build.html));
});


/*======================================
=            Задачи для CSS            =
======================================*/

gulp.task('style:build', function(cb){
	runSequence('sass', 'cssnano', cb);
});

gulp.task('sass', function(){
  return gulp.src(path.src.style)
  	.pipe(sourcemaps.init())
    	.pipe(sass())
    	.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({
    	stream: true
    }))
});

gulp.task('cssnano', function() {
    return gulp.src('build/css/main.css')
        .pipe(cssnano())
        .pipe(rename('css/main.min.css'))
        .pipe(gulp.dest('build/'))
});

/*=============================================
=            Задачи для JS                    =
=============================================*/

gulp.task('js:build', function(){
	return gulp.src(path.src.js)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(sourcemaps.init())
			.pipe(minify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.js))
});


/*=========================================
=            Задачи для Images            =
=========================================*/

gulp.task('img:build', function(){
	return gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true, 
			svgoPlugins: [{removeViewBox: false}], 
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({
	        	stream: true
	    }))
});


/*========================================
=            Задачи для Fonts            =
========================================*/

gulp.task('fonts:build', function(){
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});


/*===============================================
=            Задача для сборки всего            =
===============================================*/

gulp.task('build', [
	'html:build', 
	'style:build',
	'js:build',
	'fonts:build', 
	'img:build'
]);

gulp.task('build', function(cb){
	runSequence('clean:build', 
				'html:build', 
				['style:build', 
				'js:build'], 
				'fonts:build', 
				'img:build', 
				cb
    );
});

gulp.task('style:build', function(cb){
	runSequence('sass', 
				'cssnano', 
				cb
	);
});


/*===========================================
=            Очищаем папку build            =
===========================================*/

gulp.task('clean:build', function() {
  return del.sync('build/');
})


/*======================================
=            GULP - default            =
======================================*/

gulp.task('default', ['build', 'watch']);