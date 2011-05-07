(function( $ ) {

module( "accordion: methods", accordionSetupTeardown() );

test( "destroy", function() {
	domEqual("#list1", function() {
		$("#list1").accordion().accordion("destroy");
	});
});

test( "enable/disable", function() {
	var element = $('#list1').accordion();
	accordion_state( element, 1, 0, 0 );
	element.accordion( "disable" );
	element.accordion( "option", "active", 1 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "enable" );
	element.accordion( "option", "active", 1 );
	accordion_state( element, 0, 1, 0 );
});

test( "refresh", function() {
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( element, 246, 258 );

	element.parent().height( 500 );
	element.accordion( "refresh" );
	equalHeights( element, 446, 458 );
});

}( jQuery ) );
