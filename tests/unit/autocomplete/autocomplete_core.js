/*
 * autocomplete_core.js
 */


(function($) {

module("autocomplete: core", {
	teardown: function() {
		$( ":ui-autocomplete" ).autocomplete( "destroy" );
	}
});

test("close-on-blur is properly delayed", function() {
	var ac = $("#autocomplete").autocomplete({
		source: ["java", "javascript"]
	}).val("ja").autocomplete("search");
	same( $(".ui-menu:visible").length, 1 );
	ac.blur();
	same( $(".ui-menu:visible").length, 1 );
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 0 );
		start();
	}, 200);
});

test("close-on-blur is cancelled when starting a search", function() {
	var ac = $("#autocomplete").autocomplete({
		source: ["java", "javascript"]
	}).val("ja").autocomplete("search");
	same( $(".ui-menu:visible").length, 1 );
	ac.blur();
	same( $(".ui-menu:visible").length, 1 );
	ac.autocomplete("search");
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 1 );
		start();
	}, 200);
});

test( "prevent form submit on enter when menu is active", function() {
	var event;
	var ac = $( "#autocomplete" ).autocomplete({
		source: [ "java", "javascript" ]
	}).val( "ja" ).autocomplete( "search" );
	
	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.DOWN;
	ac.trigger( event );
	same( $( ".ui-menu-item:has(.ui-state-hover)" ).length, 1, "menu item is active" );
	
	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	ac.trigger( event );
	ok( event.isDefaultPrevented(), "default action is prevented" );
});

test( "allow form submit on enter when menu is not active", function() {
	var event;
	var ac = $( "#autocomplete" ).autocomplete({
		source: [ "java", "javascript" ]
	}).val( "ja" ).autocomplete( "search" );
	
	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	ac.trigger( event );
	ok( !event.isDefaultPrevented(), "default action is prevented" );
});

})(jQuery);
