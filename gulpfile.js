'use strict';

var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')();

var fileNames = {
	styles: path.join('themes', 'base'),
	scripts: 'ui',
};

var sourcesPaths = {
	styles: {
		base: path.join(fileNames.styles, '**', '{carousel.scss,zoom.scss,elements.scss}'),
		sass: path.join(fileNames.styles, '**', '*.{sass,scss}')
	}
};

var targetPaths = {
	styles: path.join(fileNames.targetUrl, fileNames.styles)
};

gulp.task('styles', function() {
	return gulp.src([sourcesPaths.styles.base, sourcesPaths.styles.sass]).pipe(plugins.sass({
		style : 'compact',
		precision : 8,
		errLogToConsole : true
	})).pipe(gulp.dest()).pipe(plugins.size({
		title : 'Styles'
	}));
});

gulp.task('watch', function(next) {
	gulp.watch([sourcesPaths.styles.base, sourcesPaths.styles.sass], ['stylesMin']);
	gulp.watch(sourcesPaths.scripts.base, ['scripts']);
});

// DEFAULT GULP TASK
gulp.task('default', ['init'], function() {
	gulp.start(['styles']);
});

gulp.task('default-test', ['init'], function() {
	gulp.start(['styles', 'watch']);
});