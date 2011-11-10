(function() {

var versions = [ "1.6", "1.6.1", "1.6.2", "1.6.3", "1.6.4", "1.7", "git" ];

var additionalTests = {
	accordion: [ "accordion_deprecated.html" ],
	position: [ "position_deprecated.html" ],
	tabs: [ "tabs_deprecated.html" ]
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
