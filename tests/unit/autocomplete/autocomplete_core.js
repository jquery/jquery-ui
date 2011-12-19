(function( $ ) {

module( "autocomplete: core" );

asyncTest( "close-on-blur is properly delayed", function() {
	expect( 3 );
	var element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	ok( menu.is( ":visible" ) );
	element.blur();
	ok( menu.is( ":visible" ) );
	setTimeout(function() {
		ok( menu.is( ":hidden") );
		start();
	}, 200 );
});

asyncTest( "close-on-blur is cancelled when starting a search", function() {
	expect( 3 );
	var element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	ok( menu.is( ":visible" ) );
	element.blur();
	ok( menu.is( ":visible" ) );
	element.autocomplete( "search" );
	setTimeout(function() {
		ok( menu.is( ":visible" ) );
		start();
	}, 200 );
});

test( "prevent form submit on enter when menu is active", function() {
	expect( 2 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.DOWN;
	element.trigger( event );
	deepEqual( menu.find( ".ui-menu-item:has(.ui-state-focus)" ).length, 1, "menu item is active" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	ok( event.isDefaultPrevented(), "default action is prevented" );
});

test( "allow form submit on enter when menu is not active", function() {
	expect( 1 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete({
				autoFocus: false,
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	ok( !event.isDefaultPrevented(), "default action is prevented" );
});

(function() {
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

	test( "up arrow invokes search - contenteditable", function() {
		arrowsInvokeSearch( "#autocomplete-contenteditable", true, false );
	});

	test( "down arrow invokes search - contenteditable", function() {
		arrowsInvokeSearch( "#autocomplete-contenteditable", false, false );
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

	test( "up arrow moves focus - contenteditable", function() {
		arrowsMoveFocus( "#autocomplete-contenteditable", true );
	});

	test( "down arrow moves focus - contenteditable", function() {
		arrowsMoveFocus( "#autocomplete-contenteditable", false );
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
})();

(function() {

})();

}( jQuery ) );
