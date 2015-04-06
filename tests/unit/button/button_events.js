define( [
	"jquery",
	"ui/button"
], function( $ ) {

module("button: events");

test("buttonset works with single-quote named elements (#7505)", function() {
	expect( 1 );
	$("#radio3").buttonset();
	$("#radio33").click( function(){
		ok( true, "button clicks work with single-quote named elements" );
	}).click();
});

asyncTest( "when button loses focus, ensure active state is removed (#8559)", function( assert ) {
	expect( 1 );

	var element = $( "#button" ).button();

	element.one( "keypress", function() {
		element.one( "blur", function() {
			assert.lacksClasses( element, "ui-state-active", "button loses active state appropriately" );
			start();
		}).blur();
	});

	element.focus();
	setTimeout(function() {
		element
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } )
			.simulate( "keypress", { keyCode: $.ui.keyCode.ENTER } );
	});
});

} );
