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
var notify = require('gulp-notify');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var bSync = require('browser-sync').create();

/* Const del for delete folder (cache) */
const del = require("del");
/* Get notify about error in which file and line */
var logError = function (err) {
	notify.onError({
		title: "Gulp",
		subtitle: "Chyba při kompilaci!",
		message:
			"Soubor: " +
			err.fileName.substring(
				err.fileName.lastIndexOf(
					"/"
				) + 1
			) + " na řádku: " + err.lineNumber,
		sound: "Beep"
	})(err);
	/* Show detailed log about error in console */
	gutil.log(
		gutil.colors.magenta(err)
	);
};

// Static Server + watching scss/js/phtml files
gulp.task('serve', ['less-admin', 'less-production', 'scripts'], function () {

	// Static server
	bSync.init({
		// Proxy server via MAMP
		proxy: "nette.l/"

		// Server via DIR
		/* server: {
			baseDir: "./"
		} */
	});
	// Watchers
	gulp.watch("www/assets/less/global/**/*.less", ["less-admin", "less-production"]).on("change", bSync.reload);
	gulp.watch("www/assets/less/new_template_1/**/*.less", ['less-admin']).on('change', bSync.reload);
	gulp.watch("www/assets/less/new_template_nhl/**/*.less", ["less-production"]).on("change", bSync.reload);
	gulp.watch("www/assets/js/**/**/**/*.js", ["scripts"]).on("change", bSync.reload);
	gulp.watch("app/**/*.latte").on('change', bSync.reload);
	gulp.watch("app/**/*.php").on('change', bSync.reload);
});

// Compile scss into CSS, catch error & log them into terminal
gulp.task('less-admin', function () {
	return (
		gulp
			.src("www/assets/less/new_template_1/style.less")
			.on("error", gutil.log)
			// error log & continue in progress
			.pipe(less().on("error", function (err) {
				// Notification to catch bug in compile
				logError(err);
				this.emit("end");
			}))
			// minify
			.pipe(cssmin())
			// add .min to name
			.pipe(rename({ suffix: ".min" }))
			// save to distribute destination
			.pipe(gulp.dest("www/css/new_template_1/"))
	);
});

// Compile scss into CSS - production layout
gulp.task("less-production", function () {
	return (
		gulp
			.src("www/assets/less/new_template_nhl/style.less")
			.on("error", gutil.log)
			// error log & continue in progress
			.pipe(
				less().on("error", function (err) {
					logError(err);
					this.emit("end");
				})
			)
			// minify
			.pipe(cssmin())
			// add .min to name
			.pipe(rename({ suffix: ".min" }))
			// save to distribute destination
			.pipe(gulp.dest("www/css/new_template_nhl/"))
	);
});

// Concat all script into one & uglify (minify), catch error & log them into terminal
gulp.task('scripts', function () {
	return gulp.src('www/assets/js/**/*.js')
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
		.pipe(gulp.dest('www/js/new_template_1/'))
});

gulp.task('clean', function () {
	return del(['temp/cache/**', '!temp'], { force: true });
});

// Run default task on gulp start
gulp.task('default', ['serve']);