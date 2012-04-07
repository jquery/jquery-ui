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

asyncTest( "handle race condition", function() {
	expect( 3 );
	var count = 0,
		element = $( "#autocomplete" ).autocomplete({
		source: function( request, response ) {
			count++;
			if ( request.term.length === 1 ) {
				equal( count, 1, "request with 1 character is first" );
				setTimeout(function() {
					response([ "one" ]);
					setTimeout( checkResults, 1 );
				}, 1 );
				return;
			}
			equal( count, 2, "request with 2 characters is second" );
			response([ "two" ]);
		}
	});

	element.autocomplete( "search", "a" );
	element.autocomplete( "search", "ab" );

	function checkResults() {
		equal( element.autocomplete( "widget" ).find( ".ui-menu-item" ).text(), "two",
			"correct results displayed" );
		start();
	}
});
test( "up arrow invokes search - input", function() {
	arrowsInvokeSearch( "#autocomplete", true, true );
});

test( "down arrow invokes search - input", function() {
	arrowsInvokeSearch( "#autocomplete", false, true );
});

test( "up arrow invokes search - textarea", function() {
	arrowsInvokeSearch( "#autocomplete-textarea", true, false );
});

test( "down arrow invokes search - textarea", function() {
	arrowsInvokeSearch( "#autocomplete-textarea", false, false );
});

test( "up arrow moves focus - input", function() {
	arrowsMoveFocus( "#autocomplete", true );
});

test( "down arrow moves focus - input", function() {
	arrowsMoveFocus( "#autocomplete", false );
});

test( "up arrow moves focus - textarea", function() {
	arrowsMoveFocus( "#autocomplete-textarea", true );
});

test( "down arrow moves focus - textarea", function() {
	arrowsMoveFocus( "#autocomplete-textarea", false );
});

function arrowsInvokeSearch( id, isKeyUp, shouldMove ) {
	expect( 1 );

	var didMove = false,
		element = $( id ).autocomplete({
			source: [ "a" ],
			delay: 0,
			minLength: 0
		});
	element.data( "autocomplete" )._move = function() {
		didMove = true;
	};
	element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
	equal( didMove, shouldMove, "respond to arrow" );
}

function arrowsMoveFocus( id, isKeyUp ) {
	expect( 1 );

	var didMove = false,
		element = $( id ).autocomplete({
			source: [ "a" ],
			delay: 0,
			minLength: 0
		});
	element.data( "autocomplete" )._move = function() {
		ok( true, "repsond to arrow" );
	};
	element.autocomplete( "search" );
	element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
}

}( jQuery ) );
