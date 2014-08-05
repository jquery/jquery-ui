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
		element.bind( "keypress", function( e ) {
			didMove = !e.isDefaultPrevented();
		});
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
		element.simulate( "keypress" );
		equal( didMove, shouldMove, "respond to arrow" );
	}
})();

asyncTest( "past end of menu in multiline autocomplete", function() {
	expect( 2 );

	var customVal = "custom value",
		element = $( "#autocomplete-contenteditable" ).autocomplete({
			delay: 0,
			source: [ "javascript" ],
			focus: function( event, ui ) {
				equal( ui.item.value, "javascript", "Item gained focus" );
				$( this ).text( customVal );
				event.preventDefault();
			}
		});

	element
		.simulate( "focus" )
		.autocomplete( "search", "ja" );

	setTimeout(function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( element.text(), customVal );
		start();
	}, 50 );
});

asyncTest( "ESCAPE in multiline autocomplete", function() {
	expect( 2 );

	var customVal = "custom value",
		element = $( "#autocomplete-contenteditable" ).autocomplete({
			delay: 0,
			source: [ "javascript" ],
			focus: function( event, ui ) {
				equal( ui.item.value, "javascript", "Item gained focus" );
				$( this ).text( customVal );
				event.preventDefault();
			}
		});

	element
		.simulate( "focus" )
		.autocomplete( "search", "ja" );

	setTimeout(function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( element.text(), customVal );
		start();
	}, 50 );
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
	expect( 13 );
	var element = $( "#autocomplete" ).autocomplete({
			source: [ "java", "javascript" ]
		}),
		liveRegion = element.autocomplete( "instance" ).liveRegion;

	equal( liveRegion.children().length, 0, "Empty live region on create" );
	equal( liveRegion.attr( "aria-live" ), "assertive",
		"Live region's aria-live attribute must be assertive" );
	equal( liveRegion.attr( "aria-relevant" ), "additions",
		"Live region's aria-relevant attribute must be additions" );
	equal( liveRegion.attr( "role" ), "status",
		"Live region's role attribute must be status" );

	element.autocomplete( "search", "j" );
	equal( liveRegion.children().first().text(),
		"2 results are available, use up and down arrow keys to navigate.",
		"Live region for multiple values" );

	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( liveRegion.children().filter( ":visible" ).text(), "java",
		"Live region changed on keydown to announce the highlighted value" );

	element.one( "autocompletefocus", function( event ) {
		event.preventDefault();
	});
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( liveRegion.children().filter( ":visible" ).text(), "javascript",
		"Live region updated when default focus is prevented" );

	element.autocomplete( "search", "javas" );
	equal( liveRegion.children().filter( ":visible" ).text(),
		"1 result is available, use up and down arrow keys to navigate.",
		"Live region for one value" );

	element.autocomplete( "search", "z" );
	equal( liveRegion.children().filter( ":visible" ).text(), "No search results.",
		"Live region for no values" );

	equal( liveRegion.children().length, 5,
		"Should be five children in the live region after the above" );
	equal( liveRegion.children().filter( ":visible" ).length, 1,
		"Only one should be still visible" );
	ok( liveRegion.children().filter( ":visible" )[ 0 ] === liveRegion.children().last()[ 0 ],
		"The last one should be the visible one" );

	element.autocomplete( "destroy" );
	equal( liveRegion.parent().length, 0,
		"The liveRegion should be detached after destroy" );
});

test( "ARIA, aria-label announcement", function() {
	expect( 1 );
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var that = this;
			$.each( items, function( index, item ) {
				that._renderItemData( ul, item )
					.attr( "aria-label", item.category + " : " + item.label );
			});
		}
	});
	var element = $( "#autocomplete" ).catcomplete({
			source: [ { label: "anders andersson", category: "People" } ]
		}),
		liveRegion = element.catcomplete( "instance" ).liveRegion;
	element.catcomplete( "search", "a" );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( liveRegion.children().filter( ":visible" ).text(), "People : anders andersson",
		"Live region changed on keydown to announce the highlighted value's aria-label attribute" );
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

asyncTest( "Search if the user retypes the same value (#7434)", function() {
	expect( 3 );
	var element = $( "#autocomplete" ).autocomplete({
			source: [ "java", "javascript" ],
			delay: 0
		}),
		menu = element.autocomplete( "instance" ).menu.element;

	element.val( "j" ).simulate( "keydown" );
	setTimeout(function() {
		ok( menu.is( ":visible" ), "menu displays initially" );
		element.trigger( "blur" );
		ok( !menu.is( ":visible" ), "menu hidden after blur" );
		element.val( "j" ).simulate( "keydown" );
		setTimeout(function() {
			ok( menu.is( ":visible" ), "menu displays after typing the same value" );
			start();
		});
	});
});

}( jQuery ) );
