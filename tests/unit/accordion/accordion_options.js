(function( $ ) {

module( "accordion: options", accordion_setupTeardown() );

test( "{ active: default }", function() {
	expect( 2 );
	var element = $( "#list1" ).accordion();
	equal( element.accordion( "option", "active" ), 0 );
	accordion_state( element, 1, 0, 0 );
});

test( "{ active: false }", function() {
	expect( 7 );
	var element = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	accordion_state( element, 0, 0, 0 );
	equal( element.find( ".ui-accordion-header.ui-state-active" ).size(), 0, "no headers selected" );
	equal( element.accordion( "option", "active" ), false );

	element.accordion( "option", "collapsible", false );
	accordion_state( element, 1, 0, 0 );
	equal( element.accordion( "option", "active" ), 0 );

	element.accordion( "destroy" );
	element.accordion({
		active: false
	});
	accordion_state( element, 1, 0, 0 );
	strictEqual( element.accordion( "option", "active" ), 0 );
});

test( "{ active: Number }", function() {
	expect( 8 );
	var element = $( "#list1" ).accordion({
		active: 2
	});
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );

	element.accordion( "option", "active", 0 );
	equal( element.accordion( "option", "active" ), 0 );
	accordion_state( element, 1, 0, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).click();
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	element.accordion( "option", "active", 10 );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );
});

if ( $.uiBackCompat === false ) {
	test( "{ active: -Number }", function() {
		expect( 8 );
		var element = $( "#list1" ).accordion({
			active: -1
		});
		equal( element.accordion( "option", "active" ), 2 );
		accordion_state( element, 0, 0, 1 );

		element.accordion( "option", "active", -2 );
		equal( element.accordion( "option", "active" ), 1 );
		accordion_state( element, 0, 1, 0 );

		element.accordion( "option", "active", -10 );
		equal( element.accordion( "option", "active" ), 1 );
		accordion_state( element, 0, 1, 0 );

		element.accordion( "option", "active", -3 );
		equal( element.accordion( "option", "active" ), 0 );
		accordion_state( element, 1, 0, 0 );
	});
}

// TODO: add animation tests

test( "{ collapsible: false }", function() {
	expect( 4 );
	var element = $( "#list1" ).accordion({
		active: 1
	});
	element.accordion( "option", "active", false );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).click();
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );
});

test( "{ collapsible: true }", function() {
	expect( 6 );
	var element = $( "#list1" ).accordion({
		active: 1,
		collapsible: true
	});

	element.accordion( "option", "active", false );
	equal( element.accordion( "option", "active" ), false );
	accordion_state( element, 0, 0, 0 );

	element.accordion( "option", "active", 1 );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).click();
	equal( element.accordion( "option", "active" ), false );
	accordion_state( element, 0, 0, 0 );
});

test( "{ event: null }", function() {
	expect( 5 );
	var element = $( "#list1" ).accordion({
		event: null
	});
	accordion_state( element, 1, 0, 0 );

	element.accordion( "option", "active", 1 );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	// ensure default click handler isn't bound
	element.find( ".ui-accordion-header" ).eq( 2 ).click();
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );
});

test( "{ event: custom }", function() {
	expect( 11 );
	var element = $( "#list1" ).accordion({
		event: "custom1 custom2"
	});
	accordion_state( element, 1, 0, 0 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	// ensure default click handler isn't bound
	element.find( ".ui-accordion-header" ).eq( 2 ).trigger( "click" );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );

	element.find( ".ui-accordion-header" ).eq( 2 ).trigger( "custom2" );
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );

	element.accordion( "option", "event", "custom3" );

	// ensure old event handlers are unbound
	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	equal( element.accordion( "option", "active" ), 2 );
	accordion_state( element, 0, 0, 1 );

	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom3" );
	equal( element.accordion( "option", "active" ), 1 );
	accordion_state( element, 0, 1, 0 );
});

test( "{ header: default }", function() {
	expect( 2 );
	// default: > li > :first-child,> :not(li):even
	// > :not(li):even
	accordion_state( $( "#list1" ).accordion(), 1, 0, 0);
	// > li > :first-child
	accordion_state( $( "#navigation" ).accordion(), 1, 0, 0);
});

test( "{ header: custom }", function() {
	expect( 6 );
	var element = $( "#navigationWrapper" ).accordion({
		header: "h2"
	});
	element.find( "h2" ).each(function() {
		ok( $( this ).hasClass( "ui-accordion-header" ) );
	});
	equal( element.find( ".ui-accordion-header" ).length, 3 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "option", "active", 2 );
	accordion_state( element, 0, 0, 1 );
});

test( "{ heightStyle: 'auto' }", function() {
	expect( 3 );
	var element = $( "#navigation" ).accordion({ heightStyle: "auto" });
	accordion_equalHeights( element, 95, 130 );
});

test( "{ heightStyle: 'content' }", function() {
	expect( 3 );
	var element = $( "#navigation" ).accordion({ heightStyle: "content" });
	var sizes = element.find( ".ui-accordion-content" ).map(function() {
		return $( this ).height();
	}).get();
	ok( sizes[ 0 ] >= 70 && sizes[ 0 ] <= 105, "was " + sizes[ 0 ] );
	ok( sizes[ 1 ] >= 98 && sizes[ 1 ] <= 126, "was " + sizes[ 1 ] );
	ok( sizes[ 2 ] >= 42 && sizes[ 2 ] <= 54, "was " + sizes[ 2 ] );
});

test( "{ heightStyle: 'fill' }", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	var element = $( "#navigation" ).accordion({ heightStyle: "fill" });
	accordion_equalHeights( element, 446, 458 );
});

test( "{ heightStyle: 'fill' } with sibling", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion({ heightStyle: "fill" });
	accordion_equalHeights( element , 346, 358);
});

test( "{ heightStyle: 'fill' } with multiple siblings", function() {
	expect( 3 );
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30,
			position: "absolute"
		})
		.prependTo( "#navigationWrapper" );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 25,
			marginTop: 10,
			marginBottom: 15
		})
		.prependTo( "#navigationWrapper" );
	var element = $( "#navigation" ).accordion({ heightStyle: "fill" });
	accordion_equalHeights( element, 296, 308 );
});

test( "{ icons: false }", function() {
	expect( 8 );
	var element = $( "#list1" );
	function icons( on ) {
		deepEqual( element.find( "span.ui-icon").length, on ? 3 : 0 );
		deepEqual( element.hasClass( "ui-accordion-icons" ), on );
	}
	element.accordion();
	icons( true );
	element.accordion( "destroy" ).accordion({
		icons: false
	});
	icons( false );
	element.accordion( "option", "icons", { header: "foo", activeHeader: "bar" } );
	icons( true );
	element.accordion( "option", "icons", false );
	icons( false );
});

test( "{ icons: hash }", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion({
		icons: { activeHeader: "a1", header: "h1" }
	});
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	element.accordion( "option", "icons", { activeHeader: "a2", header: "h2" } );
	ok( !element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	ok( element.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a2" ) );
});

}( jQuery ) );
