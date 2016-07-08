module.exports = function( grunt ) {

"use strict";

var versions = {
		"git": "git",
		"3.1": "3.1.0",
		"3.0": "3.0.0",
		"2.2": "2.2.4",
		"2.1": "2.1.4",
		"2.0": "2.0.3",
		"1.12": "1.12.4",
		"1.11": "1.11.3",
		"1.10": "1.10.2",
		"1.9": "1.9.1",
		"1.8": "1.8.3",
		"1.7": "1.7.2"
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

function submit( commit, runs, configFile, extra, done ) {
	var testName,
		testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).jqueryui,
		browserSets = config.browserSets,
		commitUrl = "https://github.com/jquery/jquery-ui/commit/" + commit;

	if ( extra ) {

		// jQuery >= 2.0.0 don't support IE 8.
		if ( extra.substring( 0, 6 ) !== "core 1" ) {
			browserSets = "jquery-ui-future";
		}

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

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var test,
		latestTests = {};
	for ( test in tests ) {
		latestTests[ test ] = tests[ test ] + "?nojshint=true";
	}
	submit( commit, latestTests, configFile, "", this.async() );
} );

grunt.registerTask( "testswarm-multi-jquery", function( commit, configFile, minor ) {
	var allTests = {};
	versions[ minor ].split( " " ).forEach( function( version ) {
		for ( var test in tests ) {
			allTests[ test + "-" + version ] = tests[ test ] + "?nojshint=true&jquery=" + version;
		}
	} );
	submit( commit, allTests, configFile, "core " + minor, this.async() );
} );

};
