( function() {
"use strict";

var versions = [
		"1.12.4",
		"2.2.4",
		"3.0.0",
		"3.1.0", "3.1.1",
		"3.2.0", "3.2.1",
		"3.3.0", "3.3.1",
		"3.4.0", "3.4.1",
		"3.5.0", "3.5.1",
		"3.6.0", "3.6.1", "3.6.2", "3.6.3", "3.6.4",
		"3.7.0", "3.7.1",
		"4.0.0-rc.1",
		"3.x-git", "git", "custom"
	],
	additionalTests = {

		// component: [ "other_test.html" ]
	};

window.testAllVersions = function( widget ) {
	QUnit.testSuites( $.map(
		[ widget + ".html" ].concat( additionalTests[ widget ] || [] ),
		function( test ) {
			return $.map( versions, function( version ) {
				return test + "?jquery=" + version;
			} );
		} ) );
};

} )();
