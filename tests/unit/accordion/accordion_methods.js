(function( $ ) {

module( "accordion: methods", accordionSetupTeardown() );

test( "destroy", function() {
	domEqual("#list1", function() {
		$("#list1").accordion().accordion("destroy");
	});
});

test( "enable/disable", function() {
	var accordion = $('#list1').accordion();
	state( accordion, 1, 0, 0 );
	accordion.accordion( "disable" );
	accordion.accordion( "option", "active", 1 );
	state( accordion, 1, 0, 0 );
	accordion.accordion( "enable" );
	accordion.accordion( "option", "active", 1 );
	state( accordion, 0, 1, 0 );
});

test( "refresh", function() {
	var expected = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( expected, 246, 258 );

	expected.parent().height( 500 );
	expected.accordion( "refresh" );
	equalHeights( expected, 446, 458 );
});

}( jQuery ) );
