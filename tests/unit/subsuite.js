(function() {

var versions = [
		"1.7.0", "1.7.1", "1.7.2",
		"1.8.0", "1.8.1", "1.8.2", "1.8.3",
		"1.9.0", "1.9.1",
		"1.10.0", "1.10.1", "1.10.2",
		"1.11.0", "1.11.1", "1.11.2",
		"git1"
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
			});
		}));
};

}());
