define( [
	"qunit",
	"jquery",
	"ui/widgets/resizable"
], function( QUnit, $ ) {

QUnit.module( "resizable: methods" );

QUnit.test( "disable", function( assert ) {
	assert.expect( 5 );

	var element = $( "#resizable1" ).resizable( { disabled: false } ),
		chainable = element.resizable( "disable" );

	assert.lacksClasses( element.resizable( "widget" ), "ui-state-disabled" );
	assert.ok( !element.resizable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.resizable( "widget" ), "ui-resizable-disabled" );
	assert.equal( element.resizable( "option", "disabled" ), true, "disabled option setter" );
	assert.equal( chainable, element, "disable is chainable" );
} );

} );
