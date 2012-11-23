module( "progressbar: events" );

test( "create", function() {
	expect( 1 );
	$( "#progressbar" ).progressbar({
		value: 5,
		create: function() {
			deepEqual( 5, $( this ).progressbar( "value" ) );
		},
		change: function() {
			ok( false, "create() has triggered change()" );
		}
	});
});

test( "change", function() {
	expect( 1 );
	$( "#progressbar" ).progressbar({
		change: function() {
			deepEqual( 5, $( this ).progressbar( "value" ) );
		}
	}).progressbar( "value", 5 );
});

test( "complete", function() {
	expect( 4 );
	var value,
		changes = 0,
		element = $( "#progressbar" ).progressbar({
			change: function() {
				changes++;
				deepEqual( element.progressbar( "value" ), value, "change at " + value );
			},
			complete: function() {
				equal( changes, 3, "complete triggered after change and not on indeterminate" );
			}
		});

	value = 5;
	element.progressbar( "value", value );
	value = false;
	element.progressbar( "value", value );
	value = 100;
	element.progressbar( "value", value );
});
