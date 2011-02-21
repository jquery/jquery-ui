(function( $ ) {

module( "accordion: options", accordionSetupTeardown() );

test( "{ active: default }", function() {
	var ac = $( "#list1" ).accordion();
	equals( ac.accordion( "option", "active" ), 0 );
	state( ac, 1, 0, 0 );
});

test( "{ active: false }", function() {
	var ac = $( "#list1" ).accordion({
		active: false,
		collapsible: true
	});
	state( ac, 0, 0, 0 );
	equals( ac.find( ".ui-accordion-header.ui-state-active" ).size(), 0, "no headers selected" );
	equals( ac.accordion( "option", "active" ), false );

	ac.accordion( "option", "collapsible", false );
	state( ac, 1, 0, 0 );
	equals( ac.accordion( "option", "active" ), 0 );

	ac.accordion( "destroy" );
	ac.accordion({
		active: false
	});
	state( ac, 1, 0, 0 );
	strictEqual( ac.accordion( "option", "active" ), 0 );
});

test( "{ active: Number }", function() {
	var ac = $( "#list1" ).accordion({
		active: 2
	});
	equals( ac.accordion( "option", "active" ), 2 );
	state( ac, 0, 0, 1 );

	ac.accordion( "option", "active", 0 );
	equals( ac.accordion( "option", "active" ), 0 );
	state( ac, 1, 0, 0 );

	ac.find( ".ui-accordion-header" ).eq( 1 ).click();
	equals( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	ac.accordion( "option", "active", 10 );
	equals( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );
});

if ( $.uiBackCompat === false ) {
	test( "{ active: -Number }", function() {
		var ac = $( "#list1" ).accordion({
			active: -1
		});
		equals( ac.accordion( "option", "active" ), 2 );
		state( ac, 0, 0, 1 );

		ac.accordion( "option", "active", -2 );
		equals( ac.accordion( "option", "active" ), 1 );
		state( ac, 0, 1, 0 );

		ac.accordion( "option", "active", -10 );
		equals( ac.accordion( "option", "active" ), 1 );
		state( ac, 0, 1, 0 );

		ac.accordion( "option", "active", -3 );
		equals( ac.accordion( "option", "active" ), 0 );
		state( ac, 1, 0, 0 );
	});
}

// TODO: add animation tests

test( "{ collapsible: false }", function() {
	var ac = $( "#list1" ).accordion({
		active: 1
	});
	ac.accordion( "option", "active", false );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	ac.find( ".ui-accordion-header" ).eq( 1 ).click();
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );
});

test( "{ collapsible: true }", function() {
	var ac = $( "#list1" ).accordion({
		active: 1,
		collapsible: true
	});

	ac.accordion( "option", "active", false );
	equal( ac.accordion( "option", "active" ), false );
	state( ac, 0, 0, 0 );

	ac.accordion( "option", "active", 1 );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	ac.find( ".ui-accordion-header" ).eq( 1 ).click();
	equals( ac.accordion( "option", "active" ), false );
	state( ac, 0, 0, 0 );
});

test( "{ event: null }", function() {
	var ac = $( "#list1" ).accordion({
		event: null
	});
	state( ac, 1, 0, 0 );

	ac.accordion( "option", "active", 1 );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	// ensure default click handler isn't bound
	ac.find( ".ui-accordion-header" ).eq( 2 ).click();
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );
});

test( "{ event: custom }", function() {
	var ac = $( "#list1" ).accordion({
		event: "custom1 custom2"
	});
	state( ac, 1, 0, 0 );

	ac.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	// ensure default click handler isn't bound
	ac.find( ".ui-accordion-header" ).eq( 2 ).trigger( "click" );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );

	ac.find( ".ui-accordion-header" ).eq( 2 ).trigger( "custom2" );
	equal( ac.accordion( "option", "active" ), 2 );
	state( ac, 0, 0, 1 );

	ac.accordion( "option", "event", "custom3" );

	// ensure old event handlers are unbound
	ac.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom1" );
	equal( ac.accordion( "option", "active" ), 2 );
	state( ac, 0, 0, 1 );

	ac.find( ".ui-accordion-header" ).eq( 1 ).trigger( "custom3" );
	equal( ac.accordion( "option", "active" ), 1 );
	state( ac, 0, 1, 0 );
});

test( "{ header: default }", function() {
	// default: > li > :first-child,> :not(li):even
	// > :not(li):even
	state( $( "#list1" ).accordion(), 1, 0, 0);
	// > li > :first-child
	state( $( "#navigation" ).accordion(), 1, 0, 0);
});

test( "{ header: custom }", function() {
	var ac = $( "#navigationWrapper" ).accordion({
		header: "h2"
	});
	ac.find( "h2" ).each(function() {
		ok( $( this ).hasClass( "ui-accordion-header" ) );
	});
	equal( ac.find( ".ui-accordion-header" ).length, 3 );
	state( ac, 1, 0, 0 );
	ac.accordion( "option", "active", 2 );
	state( ac, 0, 0, 1 );
});

test( "{ heightStyle: 'auto' }", function() {
	var ac = $( "#navigation" ).accordion({ heightStyle: "auto" });
	equalHeights( ac, 95, 130 );
});

test( "{ heightStyle: 'content' }", function() {
	var ac = $( "#navigation" ).accordion({ heightStyle: "content" });
	var sizes = ac.find( ".ui-accordion-content" ).map(function() {
		return $( this ).height();
	}).get();
	ok( sizes[ 0 ] >= 70 && sizes[ 0 ] <= 90, "was " + sizes[ 0 ] );
	ok( sizes[ 1 ] >= 98 && sizes[ 1 ] <= 126, "was " + sizes[ 1 ] );
	ok( sizes[ 2 ] >= 42 && sizes[ 2 ] <= 54, "was " + sizes[ 2 ] );
});

test( "{ heightStyle: 'fill' }", function() {
	$( "#navigationWrapper" ).height( 500 );
	var ac = $( "#navigation" ).accordion({ heightStyle: "fill" });
	equalHeights( ac, 446, 458 );
});

test( "{ heightStyle: 'fill' } with sibling", function() {
	$( "#navigationWrapper" ).height( 500 );
	$( "<p>Lorem Ipsum</p>" )
		.css({
			height: 50,
			marginTop: 20,
			marginBottom: 30
		})
		.prependTo( "#navigationWrapper" );
	var ac = $( "#navigation" ).accordion({ heightStyle: "fill" });
	equalHeights( ac , 346, 358);
});

test( "{ heightStyle: 'fill' } with multiple siblings", function() {
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
	var ac = $( "#navigation" ).accordion({ heightStyle: "fill" });
	equalHeights( ac, 296, 308 );
});

test( "{ icons: false }", function() {
	var list = $( "#list1" );
	function icons( on ) {
		same( list.find( "span.ui-icon").length, on ? 3 : 0 );
		same( list.hasClass( "ui-accordion-icons" ), on );
	}
	list.accordion();
	icons( true );
	list.accordion( "destroy" ).accordion({
		icons: false
	});
	icons( false );
	list.accordion( "option", "icons", { header: "foo", activeHeader: "bar" } );
	icons( true );
	list.accordion( "option", "icons", false );
	icons( false );
});

test( "{ icons: hash }", function() {
	var list = $( "#list1" ).accordion({
		icons: { activeHeader: "a1", header: "h1" }
	});
	ok( list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	list.accordion( "option", "icons", { activeHeader: "a2", header: "h2" } );
	ok( !list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a1" ) );
	ok( list.find( ".ui-accordion-header.ui-state-active span.ui-icon" ).hasClass( "a2" ) );
});

}( jQuery ) );
