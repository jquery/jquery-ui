
// Common require.config.
require.config({
	paths: {
		"helper": "../helper",
		"jquery": window.helper.jqueryUrl(),
		"jquery.simulate": "../../../external/jquery-simulate/jquery.simulate",
		"jshint": "../../../external/jshint/jshint",
		"ui": "../../../ui"
	},
	shim: {
		"jquery.simulate": [ "jquery" ]
	}
});

function require_series( dependencies, callback ) {
	var i = 0;
	function next() {
		if ( i >= dependencies.length ) {
			return callback();
		}
		require([ dependencies[ i ] ], function() {
			i++;
			next();
		});
	}
	next();
}
