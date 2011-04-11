(function( $ ) {

module( "tabs: options" );

test( "{ active: default }", function() {
	expect( 4 );

	var element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "active" ), 0, "should be 0 by default" );
	tabs_state( element, 1, 0, 0 );
	element.tabs( "destroy" );

	window.location.hash = "#fragment-3";
	element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "active" ), 2, "should be 2 based on URL" );
	tabs_state( element, 0, 0, 1 );
});

test( "{ active: false }", function() {
	expect( 7 );

	var element = $( "#tabs1" ).tabs({
		active: false,
		collapsible: true
	});
	tabs_state( element, 0, 0, 0 );
	equal( element.find( ".ui-tabs-nav .ui-state-active" ).size(), 0, "no tabs selected" );
	strictEqual( element.tabs( "option", "active" ), false );

	element.tabs( "option", "collapsible", false );
	tabs_state( element, 1, 0, 0 );
	equal( element.tabs( "option", "active" ), 0 );

	element.tabs( "destroy" );
	element.tabs({
		active: false
	});
	tabs_state( element, 1, 0, 0 );
	strictEqual( element.tabs( "option", "active" ), 0 );
});

test( "{ active: Number }", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({
		active: 2
	});
	equals( element.tabs( "option", "active" ), 2 );
	tabs_state( element, 0, 0, 1 );

	element.tabs( "option", "active", 0 );
	equals( element.tabs( "option", "active" ), 0 );
	tabs_state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav a" ).eq( 1 ).click();
	equals( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.tabs( "option", "active", 10 );
	equals( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

if ( $.uiBackCompat === false ) {
	test( "{ active: -Number }", function() {
		var element = $( "#tabs1" ).tabs({
			active: -1
		});
		equals( element.tabs( "option", "active" ), 2 );
		tabs_state( element, 0, 0, 1 );

		element.tabs( "option", "active", -2 );
		equals( element.tabs( "option", "active" ), 1 );
		tabs_state( element, 0, 1, 0 );

		element.tabs( "option", "active", -10 );
		equals( element.tabs( "option", "active" ), 1 );
		tabs_state( element, 0, 1, 0 );

		element.tabs( "option", "active", -3 );
		equals( element.tabs( "option", "active" ), 0 );
		tabs_state( element, 1, 0, 0 );
	});
}

test( "{ collapsible: false }", function() {
	expect( 4 );

	var element = $( "#tabs1" ).tabs({
		active: 1
	});
	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.find( ".ui-state-active a" ).eq( 1 ).click();
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

test( "{ collapsible: true }", function() {
	expect( 6 );

	var element = $( "#tabs1" ).tabs({
		active: 1,
		collapsible: true
	});

	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), false );
	tabs_state( element, 0, 0, 0 );

	element.tabs( "option", "active", 1 );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.find( ".ui-state-active a" ).click();
	equal( element.tabs( "option", "active" ), false );
	tabs_state( element, 0, 0, 0 );
});

test('disabled', function() {
	expect(4);

	el = $('#tabs1').tabs();
	same(el.tabs('option', 'disabled'), false, "should not disable any tab by default");

	el.tabs('option', 'disabled', [ 1 ]);
	same(el.tabs('option', 'disabled'), [ 1 ], "should set property"); // everything else is being tested in methods module...

	el.tabs('option', 'disabled', [ 0, 1 ]);
	same(el.tabs('option', 'disabled'), [ 0, 1 ], "should disable given tabs, even selected one"); // ...

	el.tabs('option', 'disabled', [ ]);
	same(el.tabs('option', 'disabled'), false, "should not disable any tab"); // ...
});

test('event', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('fx', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
