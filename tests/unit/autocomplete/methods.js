define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/autocomplete"
], function( QUnit, $, helper ) {

QUnit.module( "autocomplete: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#autocomplete", function() {
		$( "#autocomplete" ).autocomplete().autocomplete( "destroy" );
	} );
} );

QUnit.test( "search, close", function( assert ) {
	assert.expect( 6 );
	var data = [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl" ],
		element = $( "#autocomplete" ).autocomplete( {
			source: data,
			minLength: 0
		} ),
		menu = element.autocomplete( "widget" );

	assert.ok( menu.is( ":hidden" ), "menu is hidden on init" );

	element.autocomplete( "search" );
	assert.ok( menu.is( ":visible" ), "menu is visible after search" );
	assert.equal( menu.find( ".ui-menu-item" ).length, data.length, "all items for a blank search" );

	element.val( "has" ).autocomplete( "search" );
	assert.equal( menu.find( ".ui-menu-item" ).text(), "haskell", "only one item for set input value" );

	element.autocomplete( "search", "ja" );
	assert.equal( menu.find( ".ui-menu-item" ).length, 2, "only java and javascript for 'ja'" );

	element.autocomplete( "close" );
	assert.ok( menu.is( ":hidden" ), "menu is hidden after close" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete(),
		widgetElement = element.autocomplete( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.hasClasses( widgetElement, "ui-menu" );
} );

} );
