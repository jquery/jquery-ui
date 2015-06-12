define( [
	"jquery",
	"lib/helper",
	"ui/accordion"
], function( $, helper ) {

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
				$.ui.accordion.prototype.options.animate = false;
			},
			teardown: function() {
				$.ui.accordion.prototype.options.animate = animate;
			}
		};
	},

	state: function( assert, accordion ) {
		var expected = $.makeArray( arguments ).slice( 1 ),
			actual = accordion.find( ".ui-accordion-content" ).map(function() {
				return $( this ).css( "display" ) === "none" ? 0 : 1;
			}).get();
		assert.push( assert.deepEqual(actual, expected), actual, expected );
	}
} );

} );
