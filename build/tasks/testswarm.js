module.exports = function( grunt ) {

"use strict";

var versions = {
		"git": "git",
		"1.8": "1.8.0 1.8.1 1.8.2 1.8.3",
		"1.7": "1.7 1.7.1 1.7.2",
		"1.6": "1.6 1.6.1 1.6.2 1.6.3 1.6.4"
	},
	tests = {
		"Accordion": "accordion/accordion.html",
		"Autocomplete": "autocomplete/autocomplete.html",
		"Button": "button/button.html",
		"Core": "core/core.html",
		"Datepicker": "datepicker/datepicker.html",
		"Dialog": "dialog/dialog.html",
		"Dialog_deprecated": "dialog/dialog_deprecated.html",
		"Draggable": "draggable/draggable.html",
		"Droppable": "droppable/droppable.html",
		"Effects": "effects/effects.html",
		"Menu": "menu/menu.html",
		"Position": "position/position.html",
		"Progressbar": "progressbar/progressbar.html",
		"Resizable": "resizable/resizable.html",
		"Selectable": "selectable/selectable.html",
		"Slider": "slider/slider.html",
		"Sortable": "sortable/sortable.html",
		"Spinner": "spinner/spinner.html",
		"Tabs": "tabs/tabs.html",
		"Tooltip": "tooltip/tooltip.html",
		"Widget": "widget/widget.html"
	};

function submit( commit, tests, configFile, version, done ) {
	var test,
		testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jqueryui,
		testBase = config.testUrl + commit + "/tests/unit/",
		testUrls = [];
	for ( test in tests ) {
		testUrls.push( testBase + tests[ test ] );
	}
	version = version ? ( version + " " ) : "";
	testswarm({
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 45,
		done: done
	}, {
		authUsername: config.authUsername,
		authToken: config.authToken,
		jobName: 'jQuery UI ' + version + '#<a href="https://github.com/jquery/jquery-ui/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
		runMax: config.runMax,
		"runNames[]": Object.keys( tests ),
		"runUrls[]": testUrls,
		"browserSets[]": config.browserSets
	});
}

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var test,
		latestTests = {};
	for ( test in tests ) {
		latestTests[ test ] = tests[ test ] + "?nojshint=true";
	}
	submit( commit, latestTests, configFile, "", this.async() );
});

grunt.registerTask( "testswarm-multi-jquery", function( commit, configFile, minor ) {
	var allTests = {};
	versions[ minor ].split(" ").forEach(function( version ) {
		for ( var test in tests ) {
			allTests[ test + "-" + version ] = tests[ test ] + "?nojshint=true&jquery=" + version;
		}
	});
	submit( commit, allTests, configFile, minor + " core", this.async() );
});

};
