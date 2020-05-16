define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/datepicker"
], function( QUnit, $, helper ) {

return $.extend( helper, {
	addMonths: function( date, offset ) {
		var maxDay = 32 - new Date( date.getFullYear(), date.getMonth() + offset, 32 ).getDate();
		date.setDate( Math.min( date.getDate(), maxDay ) );
		date.setMonth( date.getMonth() + offset );
		return date;
	},

	equalsDate: function( assert, d1, d2, message ) {
		if ( !d1 || !d2 ) {
			assert.ok( false, message + " - missing date" );
			return;
		}
		d1 = new Date( d1.getFullYear(), d1.getMonth(), d1.getDate() );
		d2 = new Date( d2.getFullYear(), d2.getMonth(), d2.getDate() );
		assert.equal( d1.toString(), d2.toString(), message );
	},

	beforeAfterEach: function() {
		return {
			afterEach: helper.moduleAfterEach
		};
	},

	init: function( id, options ) {
		$.datepicker.setDefaults( $.datepicker.regional[ "" ] );
		return $( id ).datepicker( $.extend( { showAnim: "" }, options || {} ) );
	},

	initNewInput: function( options ) {
		var id = $( "<input>" ).appendTo( "#qunit-fixture" );
		return this.init( id, options );
	},

	PROP_NAME: "datepicker"
} );

} );
