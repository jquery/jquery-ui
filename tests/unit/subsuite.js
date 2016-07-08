( function() {

var versions = [
		"1.7.0", "1.7.1", "1.7.2",
		"1.8.0", "1.8.1", "1.8.2", "1.8.3",
		"1.9.0", "1.9.1",
		"1.10.0", "1.10.1", "1.10.2",
		"1.11.0", "1.11.1", "1.11.2", "1.11.3",
		"1.12.0", "1.12.1", "1.12.2", "1.12.3", "1.12.4",
		"2.0.0", "2.0.1", "2.0.2", "2.0.3",
		"2.1.0", "2.1.1", "2.1.2", "2.1.3", "2.1.4",
		"2.2.0", "2.2.1", "2.2.2", "2.2.3", "2.2.4",
		"3.0.0",
		"3.1.0",
		"git", "custom"
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

}() );
