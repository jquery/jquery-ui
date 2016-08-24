'use strict';

var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')();

var files = path.join('themes', 'base', '{carousel,zoom,elements}.scss');

gulp.task('styles', function() {
	return gulp.src(files).pipe(plugins.sass({
		style : 'compact',
		precision : 8,
		errLogToConsole : true
	})).pipe(gulp.dest(path.dirname(files))).pipe(plugins.size({
		title : 'Styles'
	}));
});

gulp.task('watch', function() {
	gulp.watch(files, ['styles']);
});

// DEFAULT GULP TASK
gulp.task('default', function() {
	gulp.start(['styles']);
});

gulp.task('default-test', function() {
	gulp.start(['styles', 'watch']);
});