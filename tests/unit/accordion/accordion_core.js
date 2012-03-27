(function( $ ) {

module( "accordion: core", accordion_setupTeardown() );

$.each( { div: "#list1", ul: "#navigation", dl: "#accordion-dl" }, function( type, selector ) {
	test( "markup structure: " + type, function() {
		expect( 4 );
		var element = $( selector ).accordion();
		ok( element.hasClass( "ui-accordion" ), "main element is .ui-accordion" );
		equal( element.find( ".ui-accordion-header" ).length, 3,
			".ui-accordion-header elements exist, correct number" );
		equal( element.find( ".ui-accordion-content" ).length, 3,
			".ui-accordion-content elements exist, correct number" );
		deepEqual( element.find( ".ui-accordion-header" ).next().get(),
			element.find( ".ui-accordion-content" ).get(),
			"content panels come immediately after headers" );
	});
});

test( "handle click on header-descendant", function() {
	expect( 1 );
	var element = $( "#navigation" ).accordion();
	$( "#navigation h2:eq(1) a" ).click();
	accordion_state( element, 0, 1, 0 );
});

test( "accessibility", function () {
	expect( 37 );
	var element = $( "#list1" ).accordion({
		active: 1
	});
	var headers = element.find( ".ui-accordion-header" );

	equal( element.attr( "role" ), "tablist", "element role" );
	headers.each(function( i ) {
		var header = headers.eq( i ),
			panel = header.next();
		equal( header.attr( "role" ), "tab", "header " + i + " role" );
		equal( header.attr( "aria-controls" ), panel.attr( "id" ), "header " + i + " aria-controls" );
		equal( panel.attr( "role" ), "tabpanel", "panel " + i + " role" );
		equal( panel.attr( "aria-labelledby" ), header.attr( "id" ), "panel " + i + " aria-labelledby" );
	});

	equal( headers.eq( 1 ).attr( "tabindex" ), 0, "active header has tabindex=0" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	equal( headers.eq( 1 ).next().attr( "aria-expanded" ), "true", "active tabpanel has aria-expanded=true" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "false", "active tabpanel has aria-hidden=false" );
	equal( headers.eq( 0 ).attr( "tabindex" ), -1, "active header has tabindex=-1" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "false", "active tab has aria-selected=false" );
	equal( headers.eq( 0 ).next().attr( "aria-expanded" ), "false", "active tabpanel has aria-expanded=false" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "true", "active tabpanel has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "active header has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "active tab has aria-selected=false" );
	equal( headers.eq( 2 ).next().attr( "aria-expanded" ), "false", "active tabpanel has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "active tabpanel has aria-hidden=true" );

	element.accordion( "option", "active", 0 );
	equal( headers.eq( 0 ).attr( "tabindex" ), 0, "active header has tabindex=0" );
	equal( headers.eq( 0 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	equal( headers.eq( 0 ).next().attr( "aria-expanded" ), "true", "active tabpanel has aria-expanded=true" );
	equal( headers.eq( 0 ).next().attr( "aria-hidden" ), "false", "active tabpanel has aria-hidden=false" );
	equal( headers.eq( 1 ).attr( "tabindex" ), -1, "active header has tabindex=-1" );
	equal( headers.eq( 1 ).attr( "aria-selected" ), "false", "active tab has aria-selected=false" );
	equal( headers.eq( 1 ).next().attr( "aria-expanded" ), "false", "active tabpanel has aria-expanded=false" );
	equal( headers.eq( 1 ).next().attr( "aria-hidden" ), "true", "active tabpanel has aria-hidden=true" );
	equal( headers.eq( 2 ).attr( "tabindex" ), -1, "active header has tabindex=-1" );
	equal( headers.eq( 2 ).attr( "aria-selected" ), "false", "active tab has aria-selected=false" );
	equal( headers.eq( 2 ).next().attr( "aria-expanded" ), "false", "active tabpanel has aria-expanded=false" );
	equal( headers.eq( 2 ).next().attr( "aria-hidden" ), "true", "active tabpanel has aria-hidden=true" );
});

// TODO: keyboard support

}( jQuery ) );
