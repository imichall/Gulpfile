// Variables init
var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jsValidate = require('gulp-jsvalidate');
var less = require('gulp-less');
/* var scss = require('gulp-sass'); */
var path = require('path');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var bSync = require('browser-sync').create();
var logError = function (err) {
	gutil.log(
			gutil.colors.red('CHYBA V: ') +
			gutil.colors.magenta(err.fileName) +
			gutil.colors.red(' NA ŘÁDKU: ') +
			gutil.colors.magenta(err.lineNumber)
			);	
};

// Static Server + watching scss/js/phtml files
gulp.task('serve', ['less', 'scripts'], function () {

	// Static server
	bSync.init({
		// Proxy server via MAMP
		/* proxy: "sassgrid.localhost" */

		// Server via DIR
		server: {
			baseDir: "./"
		}
	});

	// Watchers    
	gulp.watch("assets/less/**/*.less", ['less']).on('change', bSync.reload);
	gulp.watch("assets/js/**/*.js", ['scripts']).on('change', bSync.reload);
	gulp.watch("*.html").on('change', bSync.reload);
});

// Compile scss into CSS, catch error & log them into terminal
gulp.task('less', function () {
	return gulp.src("assets/less/styles.less").on('error', gutil.log)
			// error log & continue in progress
			.pipe(less().on('error', function (err) {
				logError(err);
				this.emit('end');
			}))
			// minify
			/* .pipe(cssmin()) */
			// add .min to name
			/* .pipe(rename({suffix: ".min"})) */
			// save to distribute destination
			.pipe(gulp.dest("css/less/dist"));
});

// Concat all script into one & uglify (minify), catch error & log them into terminal
gulp.task('scripts', function () {
	return gulp.src('assets/js/**/*.js')
			// error log & continue in progress
			.pipe(jsValidate().on('error', function (err) {
				logError(err);	
				this.emit('end');
			}))
			// concat		
			.pipe(concat('scripts.min.js').on('error', gutil.log))
			// uglify
			.pipe(uglify())
			// save to distribute destination
			.pipe(gulp.dest('js/dist'));
});

// Run default task on gulp start
gulp.task('default', ['serve']);

