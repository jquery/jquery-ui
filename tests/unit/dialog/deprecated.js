define( [
	"qunit",
	"jquery",
	"ui/widgets/dialog"
], function( QUnit, $ ) {

QUnit.module( "dialog (deprecated): options" );

QUnit.test( "dialogClass", function( assert ) {
	assert.expect( 5 );

	var element = $( "<div>" ).dialog(),
		widget = element.dialog( "widget" );
	assert.lacksClasses( widget, "foo", "dialogClass not specified. class not added" );
	element.remove();

	element = $( "<div>" ).dialog( { dialogClass: "foo" } );
	widget = element.dialog( "widget" );
	assert.hasClasses( widget, "foo", "dialogClass in init, foo class added" );
	element.dialog( "option", "dialogClass", "foobar" );
	assert.lacksClasses( widget, "foo", "dialogClass changed, previous one was removed" );
	assert.hasClasses( widget, "foobar", "dialogClass changed, new one was added" );
	element.remove();

	element = $( "<div>" ).dialog( { dialogClass: "foo bar" } );
	widget = element.dialog( "widget" );
	assert.hasClasses( widget, "foo bar", "dialogClass in init, two classes." );
	element.remove();
} );

} );
