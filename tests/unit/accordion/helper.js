define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/accordion"
], function( QUnit, $, helper ) {

return $.extend( helper, {
	equalHeight: function( assert, accordion, height ) {
		accordion.find( ".ui-accordion-content" ).each( function() {
			assert.equal( $( this ).outerHeight(), height );
		} );
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
		var expected = $.makeArray( arguments ).slice( 2 ),
			actual = accordion.find( ".ui-accordion-content" ).map( function() {
				return $( this ).css( "display" ) === "none" ? 0 : 1;
			} ).get();
		assert.deepEqual( actual, expected );
	}
} );

} );
