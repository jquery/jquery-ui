define( [
	"qunit",
	"jquery",
	"ui/widgets/autocomplete"
], function( QUnit, $ ) {

QUnit.module( "autocomplete: core" );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete(),
		menu = element.autocomplete( "widget" );

	assert.hasClasses( element, "ui-autocomplete-input" );
	assert.hasClasses( menu, "ui-autocomplete ui-widget ui-widget-content" );
} );

QUnit.test( "prevent form submit on enter when menu is active", function( assert ) {
	assert.expect( 2 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete( {
				source: [ "java", "javascript" ]
			} )
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.DOWN;
	element.trigger( event );
	assert.equal( menu.find( ".ui-menu-item-wrapper.ui-state-active" ).length, 1,
		"menu item is active" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	assert.ok( event.isDefaultPrevented(), "default action is prevented" );
} );

QUnit.test( "allow form submit on enter when menu is not active", function( assert ) {
	assert.expect( 1 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete( {
				autoFocus: false,
				source: [ "java", "javascript" ]
			} )
			.val( "ja" )
			.autocomplete( "search" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	assert.ok( !event.isDefaultPrevented(), "default action is prevented" );
} );

( function() {
	QUnit.test( "up arrow invokes search - input", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete", true, true );
	} );

	QUnit.test( "down arrow invokes search - input", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete", false, true );
	} );

	QUnit.test( "up arrow invokes search - textarea", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete-textarea", true, false );
	} );

	QUnit.test( "down arrow invokes search - textarea", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete-textarea", false, false );
	} );

	QUnit.test( "up arrow invokes search - contenteditable", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete-contenteditable", true, false );
	} );

	QUnit.test( "down arrow invokes search - contenteditable", function( assert ) {
		arrowsInvokeSearch( assert, "#autocomplete-contenteditable", false, false );
	} );

	QUnit.test( "up arrow moves focus - input", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete", true );
	} );

	QUnit.test( "down arrow moves focus - input", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete", false );
	} );

	QUnit.test( "up arrow moves focus - textarea", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete-textarea", true );
	} );

	QUnit.test( "down arrow moves focus - textarea", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete-textarea", false );
	} );

	QUnit.test( "up arrow moves focus - contenteditable", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete-contenteditable", true );
	} );

	QUnit.test( "down arrow moves focus - contenteditable", function( assert ) {
		arrowsMoveFocus( assert, "#autocomplete-contenteditable", false );
	} );

	QUnit.test( "up arrow moves cursor - input", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete", true, false );
	} );

	QUnit.test( "down arrow moves cursor - input", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete", false, false );
	} );

	QUnit.test( "up arrow moves cursor - textarea", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete-textarea", true, true );
	} );

	QUnit.test( "down arrow moves cursor - textarea", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete-textarea", false, true );
	} );

	QUnit.test( "up arrow moves cursor - contenteditable", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete-contenteditable", true, true );
	} );

	QUnit.test( "down arrow moves cursor - contenteditable", function( assert ) {
		arrowsNavigateElement( assert, "#autocomplete-contenteditable", false, true );
	} );

	function arrowsInvokeSearch( assert, id, isKeyUp, shouldMove ) {
		assert.expect( 1 );

		var didMove = false,
			element = $( id ).autocomplete( {
				source: [ "a" ],
				delay: 0,
				minLength: 0
			} );
		element.autocomplete( "instance" )._move = function() {
			didMove = true;
		};
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
		assert.equal( didMove, shouldMove, "respond to arrow" );
	}

	function arrowsMoveFocus( assert, id, isKeyUp ) {
		assert.expect( 1 );

		var element = $( id ).autocomplete( {
				source: [ "a" ],
				delay: 0,
				minLength: 0
			} );
		element.autocomplete( "instance" )._move = function() {
			assert.ok( true, "repsond to arrow" );
		};
		element.autocomplete( "search" );
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
	}

	function arrowsNavigateElement( assert, id, isKeyUp, shouldMove ) {
		assert.expect( 1 );

		var didMove = false,
			element = $( id ).autocomplete( {
				source: [ "a" ],
				delay: 0,
				minLength: 0
			} );
		element.on( "keypress", function( e ) {
			didMove = !e.isDefaultPrevented();
		} );
		element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
		element.simulate( "keypress" );
		assert.equal( didMove, shouldMove, "respond to arrow" );
	}
} )();

QUnit.test( "past end of menu in multiline autocomplete", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var customVal = "custom value",
		element = $( "#autocomplete-contenteditable" ).autocomplete( {
			delay: 0,
			source: [ "javascript" ],
			focus: function( event, ui ) {
				assert.equal( ui.item.value, "javascript", "Item gained focus" );
				$( this ).text( customVal );
				event.preventDefault();
			}
		} );

	element
		.simulate( "focus" )
		.autocomplete( "search", "ja" );

	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( element.text(), customVal );
		ready();
	} );
} );

QUnit.test( "ESCAPE in multiline autocomplete", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var customVal = "custom value",
		element = $( "#autocomplete-contenteditable" ).autocomplete( {
			delay: 0,
			source: [ "javascript" ],
			focus: function( event, ui ) {
				assert.equal( ui.item.value, "javascript", "Item gained focus" );
				$( this ).text( customVal );
				event.preventDefault();
			}
		} );

	element
		.simulate( "focus" )
		.autocomplete( "search", "ja" );

	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( element.text(), customVal );
		ready();
	} );
} );

QUnit.test( "handle race condition", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );
	var count = 0,
		element = $( "#autocomplete" ).autocomplete( {
		source: function( request, response ) {
			count++;
			if ( request.term.length === 1 ) {
				assert.equal( count, 1, "request with 1 character is first" );
				setTimeout( function() {
					response( [ "one" ] );
					setTimeout( checkResults );
				} );
				return;
			}
			assert.equal( count, 2, "request with 2 characters is second" );
			response( [ "two" ] );
		}
	} );

	element.autocomplete( "search", "a" );
	element.autocomplete( "search", "ab" );

	function checkResults() {
		assert.equal( element.autocomplete( "widget" ).find( ".ui-menu-item" ).text(), "two",
			"correct results displayed" );
		ready();
	}
} );

QUnit.test( "simultaneous searches (#9334)", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: function( request, response ) {
				setTimeout( function() {
					response( [ request.term ] );
				} );
			},
			response: function() {
				assert.ok( true, "response from first instance" );
			}
		} ),
		element2 = $( "#autocomplete-textarea" ).autocomplete( {
			source: function( request, response ) {
				setTimeout( function() {
					response( [ request.term ] );
				} );
			},
			response: function() {
				assert.ok( true, "response from second instance" );
				ready();
			}
		} );

	element.autocomplete( "search", "test" );
	element2.autocomplete( "search", "test" );
} );

QUnit.test( "ARIA", function( assert ) {
	assert.expect( 13 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: [ "java", "javascript" ]
		} ),
		liveRegion = element.autocomplete( "instance" ).liveRegion;

	assert.equal( liveRegion.children().length, 0, "Empty live region on create" );
	assert.equal( liveRegion.attr( "aria-live" ), "assertive",
		"Live region's aria-live attribute must be assertive" );
	assert.equal( liveRegion.attr( "aria-relevant" ), "additions",
		"Live region's aria-relevant attribute must be additions" );
	assert.equal( liveRegion.attr( "role" ), "status",
		"Live region's role attribute must be status" );

	element.autocomplete( "search", "j" );
	assert.equal( liveRegion.children().first().text(),
		"2 results are available, use up and down arrow keys to navigate.",
		"Live region for multiple values" );

	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( liveRegion.children().filter( ":visible" ).text(), "java",
		"Live region changed on keydown to announce the highlighted value" );

	element.one( "autocompletefocus", function( event ) {
		event.preventDefault();
	} );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( liveRegion.children().filter( ":visible" ).text(), "javascript",
		"Live region updated when default focus is prevented" );

	element.autocomplete( "search", "javas" );
	assert.equal( liveRegion.children().filter( ":visible" ).text(),
		"1 result is available, use up and down arrow keys to navigate.",
		"Live region for one value" );

	element.autocomplete( "search", "z" );
	assert.equal( liveRegion.children().filter( ":visible" ).text(), "No search results.",
		"Live region for no values" );

	assert.equal( liveRegion.children().length, 5,
		"Should be five children in the live region after the above" );
	assert.equal( liveRegion.children().filter( ":visible" ).length, 1,
		"Only one should be still visible" );
	assert.ok( liveRegion.children().filter( ":visible" )[ 0 ] === liveRegion.children().last()[ 0 ],
		"The last one should be the visible one" );

	element.autocomplete( "destroy" );
	assert.equal( liveRegion.parent().length, 0,
		"The liveRegion should be detached after destroy" );
} );

QUnit.test( "ARIA, aria-label announcement", function( assert ) {
	assert.expect( 1 );
	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var that = this;
			$.each( items, function( index, item ) {
				that._renderItemData( ul, item )
					.attr( "aria-label", item.category + " : " + item.label );
			} );
		}
	} );
	var element = $( "#autocomplete" ).catcomplete( {
			source: [ { label: "anders andersson", category: "People" } ]
		} ),
		liveRegion = element.catcomplete( "instance" ).liveRegion;
	element.catcomplete( "search", "a" );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( liveRegion.children().filter( ":visible" ).text(), "People : anders andersson",
		"Live region changed on keydown to announce the highlighted value's aria-label attribute" );
} );

QUnit.test( "ARIA, init on detached input", function( assert ) {
	assert.expect( 1 );
	var element = $( "<input>" ).autocomplete( {
			source: [ "java", "javascript" ]
		} ),
		liveRegion = element.autocomplete( "instance" ).liveRegion;
	assert.equal( liveRegion.parent().length, 1, "liveRegion must have a parent" );
} );

QUnit.test( ".replaceWith() (#9172)", function( assert ) {
	assert.expect( 1 );

	var element = $( "#autocomplete" ).autocomplete(),
		replacement = "<div>test</div>",
		parent = element.parent();
	element.replaceWith( replacement );
	assert.equal( parent.html().toLowerCase(), replacement );
} );

QUnit.test( "Search if the user retypes the same value (#7434)", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: [ "java", "javascript" ],
			delay: 0
		} ),
		menu = element.autocomplete( "instance" ).menu.element;

	element.val( "j" ).simulate( "keydown" );
	setTimeout( function() {
		assert.ok( menu.is( ":visible" ), "menu displays initially" );
		element.trigger( "blur" );
		assert.ok( !menu.is( ":visible" ), "menu hidden after blur" );
		element.val( "j" ).simulate( "keydown" );
		setTimeout( function() {
			assert.ok( menu.is( ":visible" ), "menu displays after typing the same value" );
			ready();
		} );
	} );
} );

QUnit.test( "Close on click outside when focus remains", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var element = $( "#autocomplete" ).autocomplete( {
		source: [ "java", "javascript" ],
		delay: 0
	} );
	var menu = element.autocomplete( "widget" );

	$( "body" ).on( "mousedown", function( event ) {
		event.preventDefault();
	} );

	element.val( "j" ).autocomplete( "search", "j" );
	setTimeout( function() {
		assert.ok( menu.is( ":visible" ), "menu displays initially" );
		$( "body" ).simulate( "mousedown" );
		setTimeout( function() {
			assert.ok( menu.is( ":hidden" ), "menu closes after clicking elsewhere" );
			ready();
		} );
	} );
} );

} );
