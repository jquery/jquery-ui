/*
 * progressbar_events.js
 */
(function($) {

module("progressbar: events");

test("create", function() {
	expect(1);
	$("#progressbar").progressbar({
		value: 5,
		create: function() {
			same(5, $(this).progressbar("value") );
		},
		change: function() {
			ok(false, 'create() has triggered change()');
		}
	})
});

test("change", function() {
	expect(1);
	$("#progressbar").progressbar({
		change: function() {
			same( 5, $(this).progressbar("value") );
		}
	}).progressbar("value", 5);
});

test( "complete", function() {
	expect( 3 );
	var changes = 0,
		value;
	
	$( "#progressbar" ).progressbar({
		change: function() {
			changes++;
			same( $( this ).progressbar( "value" ), value, "change at " + value );
		},
		complete: function() {
			equal( changes, 2, "complete triggered after change" );
		}
	});
	
	value = 5;
	$( "#progressbar" ).progressbar( "value", value );
	value = 100;
	$( "#progressbar" ).progressbar( "value", value );
});

})(jQuery);
