/*
 * button_events.js
 */
(function($) {

module("button: events");

test("buttonset works with single-quote named elements (#7505)", function() {
	expect( 1 );
	$("#radio3").buttonset();
	$("#radio33").click( function(){
		ok( true, "button clicks work with single-quote named elements" );
	}).click();
});

test( "when button loses focus, ensure active state is removed (#8559)", function() {
	expect( 1 );

	$("#button").button().keypress( function() {
		$("#button").one( "blur", function() {
			ok( !$("#button").is(".ui-state-active"), "button loses active state appropriately" );
		}).blur();
	}).focus().simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } ).simulate( "keypress", { keyCode: $.ui.keyCode.ENTER } );
});

})(jQuery);
