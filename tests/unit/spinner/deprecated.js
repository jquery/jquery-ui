define( [
	"jquery",
	"ui/widgets/spinner"
], function( $ ) {

var originalSpinner = $.ui.spinner.prototype;
module( "spinner: deprecated", {
	setup: function() {
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

	teardown: function() {
		$.ui.spinner.prototype = originalSpinner;
	}
} );

test( "markup structure - custom", function( assert ) {
	expect( 2 );
	var element = $( "#spin" ).spinner(),
		spinner = element.spinner( "widget" ),
		up = spinner.find( ".ui-spinner-up" );

	assert.hasClasses( spinner, "ui-spinner ui-widget ui-widget-content spin-wrap", "_uiSpinnerHtml() overides default markup" );
	assert.hasClasses( up, "ui-spinner-button ui-spinner-up ui-widget spin-up", "_ButtonHtml() overides default markup" );
} );

} );
