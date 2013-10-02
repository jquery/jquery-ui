module.exports = function( grunt ) {

"use strict";

var versions = {
		"git": "git",
		"1.9": "1.9.0 1.9.1",
		"1.8": "1.8.0 1.8.1 1.8.2 1.8.3",
		"1.7": "1.7 1.7.1 1.7.2",
		"1.6": "1.6 1.6.1 1.6.2 1.6.3 1.6.4"
	},
	tests = {
		"Accordion": "accordion/accordion.html",
		"Accordion_deprecated": "accordion/accordion_deprecated.html",
		"Autocomplete": "autocomplete/autocomplete.html",
		"Button": "button/button.html",
		"Core": "core/core.html",
		//"datepicker/datepicker.html",
		//"dialog/dialog.html",
		//"draggable/draggable.html",
		//"droppable/droppable.html",
		"Effects": "effects/effects.html",
		"Menu": "menu/menu.html",
		"Position": "position/position.html",
		"Position_deprecated": "position/position_deprecated.html",
		"Progressbar": "progressbar/progressbar.html",
		//"resizable/resizable.html",
		//"selectable/selectable.html",
		//"slider/slider.html",
		//"sortable/sortable.html",
		"Spinner": "spinner/spinner.html",
		"Tabs": "tabs/tabs.html",
		"Tabs_deprecated": "tabs/tabs_deprecated.html",
		"Tooltip": "tooltip/tooltip.html",
		"Widget": "widget/widget.html"
	};

function submit( commit, runs, configFile, extra, done ) {
	var testName,
		testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jqueryui,
		commitUrl = "https://github.com/jquery/jquery-ui/commit/" + commit;

	extra = " (1.9" + ( extra ? "; " + extra : "" ) + ")";

	for ( testName in runs ) {
		runs[ testName ] = config.testUrl + commit + "/tests/unit/" + runs[ testName ];
	}

	testswarm.createClient({
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 45
	})
	.addReporter( testswarm.reporters.cli )
	.auth({
		id: config.authUsername,
		token: config.authToken
	})
	.addjob({
		name: "Commit <a href='" + commitUrl + "'>" + commit.substr( 0, 10 ) + "</a>" + extra,
		runs: runs,
		runMax: config.runMax,
		browserSets: config.browserSets
	}, function( error, passed ) {
		if ( error ) {
			grunt.log.error( error );
		}
		done( passed );
	});
}

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var test,
		latestTests = {};
	for ( test in tests ) {
		latestTests[ test ] = tests[ test ] + "?nojshint=true";
	}
	submit( commit, latestTests, configFile, false, this.async() );
});

grunt.registerTask( "testswarm-multi-jquery", function( commit, configFile, minor ) {
	var allTests = {};
	versions[ minor ].split(" ").forEach(function( version ) {
		for ( var test in tests ) {
			allTests[ test + "-" + version ] = tests[ test ] + "?nojshint=true&jquery=" + version;
		}
	});
	submit( commit, allTests, configFile, "core " + minor, this.async() );
});

};
