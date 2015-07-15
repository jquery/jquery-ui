define( [
	"jquery",
	"ui/resizable"
], function( $ ) {

module( "resizable: methods" );

test( "disable", function( assert ) {
	expect( 5 );

	var element = $( "#resizable1" ).resizable({ disabled: false }),
		chainable = element.resizable( "disable" );

	assert.lacksClasses( element.resizable( "widget" ), "ui-state-disabled" );
	ok( !element.resizable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.resizable( "widget" ), "ui-resizable-disabled" );
	equal( element.resizable( "option", "disabled" ), true, "disabled option setter" );
	equal( chainable, element, "disable is chainable" );
});

} );
