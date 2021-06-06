define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/spinner"
], function( QUnit, $, helper ) {
"use strict";

var originalSpinner = $.ui.spinner.prototype;
QUnit.module( "spinner: deprecated", {
	beforeEach: function() {
		$.widget( "ui.spinner", $.ui.spinner, {
			_uiSpinnerHtml: function() {
				return "<span class='spin-wrap'>";
			},

			_buttonHtml: function() {
				return "" +
					"<a class='spin-up'>" +
						"<span>&#9650;</span>" +
					"</a>" +
					"<a>" +
						"<span>&#9660;</span>" +
					"</a>";
			}
		} );
	},

	afterEach: function() {
		$.ui.spinner.prototype = originalSpinner;
		return helper.moduleAfterEach.apply( this, arguments );
	}
} );

QUnit.test( "markup structure - custom", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).spinner(),
		spinner = element.spinner( "widget" ),
		up = spinner.find( ".ui-spinner-up" );

	assert.hasClasses( spinner, "ui-spinner ui-widget ui-widget-content spin-wrap", "_uiSpinnerHtml() overides default markup" );
	assert.hasClasses( up, "ui-spinner-button ui-spinner-up ui-widget spin-up", "_ButtonHtml() overides default markup" );
} );

} );
