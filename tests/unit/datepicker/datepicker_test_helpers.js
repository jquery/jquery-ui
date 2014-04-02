TestHelpers.datepicker = {
	addMonths: function(date, offset) {
		var maxDay = 32 - new Date(date.getFullYear(), date.getMonth() + offset, 32).getDate();
		date.setDate(Math.min(date.getDate(), maxDay));
		date.setMonth(date.getMonth() + offset);
		return date;
	},
	equalsDate: function(d1, d2, message) {
		if (!d1 || !d2) {
			ok(false, message + " - missing date");
			return;
		}
		d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
		d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
		equal(d1.toString(), d2.toString(), message);
	},
	equalsRange: function(d1, d2, message) {
		if (!d1 || !d2) {
			ok(false, message + " - missing ranges");
			return;
		}
		d11 = new Date(d1[0].getFullYear(), d1[0].getMonth(), d1[0].getDate());
		d12 = new Date(d1[1].getFullYear(), d1[1].getMonth(), d1[1].getDate());
		d21 = new Date(d2[0].getFullYear(), d2[0].getMonth(), d2[0].getDate());
		d22 = new Date(d2[1].getFullYear(), d2[1].getMonth(), d2[1].getDate());
		equal(d11.toString(), d21.toString(), message);
		equal(d12.toString(), d22.toString(), message);
	},
	init: function( id, options ) {
		$.datepicker.setDefaults( $.datepicker.regional[ "" ] );
		return $( id ).datepicker( $.extend( { showAnim: "" }, options || {} ) );
	},
	initNewInput: function( options ) {
		var id = $( "<input>" ).appendTo( "#qunit-fixture" );
		return TestHelpers.datepicker.init( id, options );
	},
	onFocus: TestHelpers.onFocus,
	PROP_NAME: "datepicker"
};