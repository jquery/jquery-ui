"use strict";

module.exports = function( grunt ) {

var versions = {
		"git": "git",
		"3.x-git": "3.x-git",
		"3.7": "3.7.0",
		"3.6": "3.6.4",
		"3.5": "3.5.1",
		"3.4": "3.4.1",
		"3.3": "3.3.1",
		"3.2": "3.2.1",
		"3.1": "3.1.1",
		"3.0": "3.0.0",
		"2.2": "2.2.4",
		"2.1": "2.1.4",
		"2.0": "2.0.3",
		"1.12": "1.12.4",
		"1.11": "1.11.3",
		"1.10": "1.10.2",
		"1.9": "1.9.1",
		"1.8": "1.8.3"
	},
	tests = {
		"Accordion": "accordion/accordion.html",
		"Autocomplete": "autocomplete/autocomplete.html",
		"Button": "button/button.html",
		"Checkboxradio": "checkboxradio/checkboxradio.html",
		"Controlgroup": "controlgroup/controlgroup.html",
		"Core": "core/core.html",
		"Datepicker": "datepicker/datepicker.html",
		"Dialog": "dialog/dialog.html",
		"Draggable": "draggable/draggable.html",
		"Droppable": "droppable/droppable.html",
		"Effects": "effects/effects.html",
		"Form Reset Mixin": "form-reset-mixin/form-reset-mixin.html",
		"Menu": "menu/menu.html",
		"Position": "position/position.html",
		"Progressbar": "progressbar/progressbar.html",
		"Resizable": "resizable/resizable.html",
		"Selectable": "selectable/selectable.html",
		"Selectmenu": "selectmenu/selectmenu.html",
		"Slider": "slider/slider.html",
		"Sortable": "sortable/sortable.html",
		"Spinner": "spinner/spinner.html",
		"Tabs": "tabs/tabs.html",
		"Tooltip": "tooltip/tooltip.html",
		"Widget": "widget/widget.html"
	};

function submit( commit, runs, configFile, browserSets, extra, done ) {
	var testName,
		testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jqueryui,
		commitUrl = "https://github.com/jquery/jquery-ui/commit/" + commit;

	browserSets = browserSets || config.browserSets;
	if ( browserSets[ 0 ] === "[" ) {

		// We got an array, parse it
		browserSets = JSON.parse( browserSets );
	}

	if ( extra ) {
		extra = " (" + extra + ")";
	}

	for ( testName in runs ) {
		runs[ testName ] = config.testUrl + commit + "/tests/unit/" + runs[ testName ];
	}

	testswarm.createClient( {
		url: config.swarmUrl
	} )
		.addReporter( testswarm.reporters.cli )
		.auth( {
			id: config.authUsername,
			token: config.authToken
		} )
		.addjob( {
			name: "Commit <a href='" + commitUrl + "'>" + commit.substr( 0, 10 ) + "</a>" + extra,
			runs: runs,
			runMax: config.runMax,
			browserSets: browserSets,
			timeout: 1000 * 60 * 30
		}, function( error, passed ) {
			if ( error ) {
				grunt.log.error( error );
			}
			done( passed );
		} );
}

grunt.registerTask( "testswarm", function( commit, configFile, browserSets ) {
	var test,
		latestTests = {};
	for ( test in tests ) {
		latestTests[ test ] = tests[ test ];
	}
	submit( commit, latestTests, configFile, browserSets, "", this.async() );
} );

grunt.registerTask( "testswarm-multi-jquery", function( commit, configFile, minor, browserSets ) {
	var allTests = {};
	versions[ minor ].split( " " ).forEach( function( version ) {
		for ( var test in tests ) {
			allTests[ test + "-" + version ] = tests[ test ] + "?jquery=" + version;
		}
	} );
	submit( commit, allTests, configFile, browserSets, "core " + minor, this.async() );
} );

};
