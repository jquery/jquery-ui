(function( $ ) {

module( "autocomplete: core" );

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
	equal( menu.find( ".ui-menu-item.ui-state-focus" ).length, 1, "menu item is active" );

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

	test( "up arrow moves cursor - input", function() {
		arrowsNavigateElement( "#autocomplete", true, false );
	});

	test( "down arrow moves cursor - input", function() {
		arrowsNavigateElement( "#autocomplete", false, false );
	});

	test( "up arrow moves cursor - textarea", function() {
		arrowsNavigateElement( "#autocomplete-textarea", true, true );
	});

	test( "down arrow moves cursor - textarea", function() {
		arrowsNavigateElement( "#autocomplete-textarea", false, true );
	});

	test( "up arrow moves cursor - contenteditable", function() {
		arrowsNavigateElement( "#autocomplete-contenteditable", true, true );
	});

	test( "down arrow moves cursor - contenteditable", function() {
		arrowsNavigateElement( "#autocomplete-contenteditable", false, true );
	});

	function arrowsInvokeSearch( id, isKeyUp, shouldMove ) {
		expect( 1 );

		var didMove = false,
			element = $( id ).autocomplete({
				source: [ "a" ],
				delay: 0,
				minLength: 0
			});
		element.autocomplete( "instance" )._move = function() {
			didMove = true;
		};
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
		equal( didMove, shouldMove, "respond to arrow" );
	}

	function arrowsMoveFocus( id, isKeyUp ) {
		expect( 1 );

		var element = $( id ).autocomplete({
				source: [ "a" ],
				delay: 0,
				minLength: 0
			});
		element.autocomplete( "instance" )._move = function() {
			ok( true, "repsond to arrow" );
		};
		element.autocomplete( "search" );
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
	}

	function arrowsNavigateElement( id, isKeyUp, shouldMove ) {
		expect( 1 );

		var didMove = false,
			element = $( id ).autocomplete({
				source: [ "a" ],
				delay: 0,
				minLength: 0
			});
		element.on( "keypress", function( e ) {
			didMove = !e.isDefaultPrevented();
		});
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
		element.simulate( "keypress" );
		equal( didMove, shouldMove, "respond to arrow" );
	}
})();

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

asyncTest( "simultaneous searches (#9334)", function() {
	expect( 2 );
	var element = $( "#autocomplete" ).autocomplete({
			source: function( request, response ) {
				setTimeout(function() {
					response([ request.term ]);
				});
			},
			response: function() {
				ok( true, "response from first instance" );
			}
		}),
		element2 = $( "#autocomplete-textarea" ).autocomplete({
			source: function( request, response ) {
				setTimeout(function() {
					response([ request.term ]);
				});
			},
			response: function() {
				ok( true, "response from second instance" );
				start();
			}
		});

	element.autocomplete( "search", "test" );
	element2.autocomplete( "search", "test" );
});

test( "ARIA", function() {
	expect( 7 );
	var element = $( "#autocomplete" ).autocomplete({
			source: [ "java", "javascript" ]
		}),
		liveRegion = element.autocomplete( "instance" ).liveRegion;

	equal( liveRegion.text(), "", "Empty live region on create" );

	element.autocomplete( "search", "j" );
	equal( liveRegion.text(), "2 results are available, use up and down arrow keys to navigate.",
		"Live region for multiple values" );

	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( liveRegion.text(), "2 results are available, use up and down arrow keys to navigate.",
		"Live region not changed on focus" );

	element.one( "autocompletefocus", function( event ) {
		event.preventDefault();
	});
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( liveRegion.text(), "javascript",
		"Live region updated when default focus is prevented" );

	element.autocomplete( "search", "javas" );
	equal( liveRegion.text(), "1 result is available, use up and down arrow keys to navigate.",
		"Live region for one value" );

	element.autocomplete( "search", "z" );
	equal( liveRegion.text(), "No search results.",
		"Live region for no values" );

	element.autocomplete( "search", "j" );
	equal( liveRegion.text(), "2 results are available, use up and down arrow keys to navigate.",
		"Live region for multiple values" );
});

test( "ARIA, init on detached input", function() {
	expect( 1 );
	var element = $( "<input>" ).autocomplete({
			source: [ "java", "javascript" ]
		}),
		liveRegion = element.autocomplete( "instance" ).liveRegion;
	equal( liveRegion.parent().length, 1, "liveRegion must have a parent" );
});

test( ".replaceWith() (#9172)", function() {
	expect( 1 );

	var element = $( "#autocomplete" ).autocomplete(),
		replacement = "<div>test</div>",
		parent = element.parent();
	element.replaceWith( replacement );
	equal( parent.html().toLowerCase(), replacement );
});

}( jQuery ) );
