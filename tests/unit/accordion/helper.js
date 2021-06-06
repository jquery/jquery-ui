define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/accordion"
], function( QUnit, $, helper ) {
"use strict";

return $.extend( helper, {
	equalHeight: function( assert, accordion, height ) {
		accordion.find( ".ui-accordion-content" ).each( function() {
			assert.equal( $( this ).outerHeight(), height );
		} );
	},

	beforeAfterEach: function() {
		var animate = $.ui.accordion.prototype.options.animate;
		return {
			beforeEach: function() {
				$.ui.accordion.prototype.options.animate = false;
			},
			afterEach: function() {
				$.ui.accordion.prototype.options.animate = animate;
				return helper.moduleAfterEach.apply( this, arguments );
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
