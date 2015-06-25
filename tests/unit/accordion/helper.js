define( [
	"jquery",
	"lib/helper",
	"lib/bootstrap",
	"lib/css",
	"text!unit/accordion/accordion.html",
	"ui/accordion"
], function( $, helper, bootstrap, cssjs, htmlContent ) {

bootstrap( { widget: "accordion" } );
cssjs( { module: "core accordion" } );

return $.extend( helper, {
	equalHeight: function( assert, accordion, height ) {
		accordion.find( ".ui-accordion-content" ).each(function() {
			equal( $( this ).outerHeight(), height );
		});
	},

	setupTeardown: function() {
		var animate = $.ui.accordion.prototype.options.animate;
		return {
			setup: function() {
				$("html").append(htmlContent);
				$.ui.accordion.prototype.options.animate = false;
			},
			teardown: function() {
				$("#qunit-fixture").remove();
				$.ui.accordion.prototype.options.animate = animate;
			}
		};
	},

	state: function( assert, accordion ) {
		var expected = $.makeArray( arguments ).slice( 2 ),
			actual = accordion.find( ".ui-accordion-content" ).map(function() {
				return $( this ).css( "display" ) === "none" ? 0 : 1;
			}).get();
		assert.push( assert.deepEqual(actual, expected), actual, expected, "State Assert" );
	}
} );

} );
